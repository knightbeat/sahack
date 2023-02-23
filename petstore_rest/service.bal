import wso2/choreo.sendemail;
import ballerina/http;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/sql;
import ballerina/io;

type DatabaseConfig record {|
    string host;
    int port;
    string user;
    string password;
    string database;
|};

type Product record {|
    readonly int id;
    string title;
    string description;
    string includes;
    string inc_for;
    string color;
    string material;
    float unit_price;
|};

type MessageResponse record {
    string message;
};

type Subscription record {|
    int item_id;
    string email;
|};

type SubscriptionList record {|
    Subscription[] subscriptions;
|};

sendemail:Client sendemailEp = check new ();

# A service representing a network-accessible API
# bound to port `9091`.
service / on new http:Listener(9091) {

    // A resource function post to add Product to the inventory
    # + product - Product to be added
    # + return - Product added or error
    resource function post product(@http:Payload Product product) returns Product|error {
        // Send a response back to the caller.
        error? result = addProductToDatabase(product);
        if result is error {
            return result;
        }
        return product;
    }

    # + product - Product to be updated
    # + return - MessageResponse or error
    resource function put product(@http:Payload Product product) returns MessageResponse|error {
        // check if the new price is less than the previous price
        boolean|error isPriceLowered = isLessThanPreviousPrice(product);
        io:println(string `isPriceLowered: ${check isPriceLowered}`);

        if isPriceLowered is error {
            return isPriceLowered;
        } else {
            if (isPriceLowered) {
                // send emails to the customers who have subscribed to the product
                error? result = sendEmails(product);
                if result is error {
                    return result;
                }
            }
        }

        // update the product in the database
        int|error result = updateProductInDatabase(product);

        if result is error {
            return result;
        } else {
            MessageResponse messageResponse = {message: string `${<int>result} rows Updated successfully`};
            return messageResponse;
        }
    }

    # + id - id of the product to be deleted
    # + return - MessageResponse or error
    resource function delete product(int id) returns MessageResponse|error {
        // Send a response back to the caller.
        int|error result = deleteProductFromDatabase(id);
        if result is error {
            return result;
        } else {
            MessageResponse messageResponse = {message: string `${<int>result} rows Deleted successfully`};
            return messageResponse;
        }
    }

    resource function post subscribe(string email, int item_id) returns MessageResponse|error {
        // Send a response back to the caller.
        error? result = addToSubscriptionList(item_id, email);
        if result is error {
            return result;
        }
        MessageResponse messageResponse = {message: string `Successfully subscribed to the product`};
        return messageResponse;
    }

    # A resource for generating greetings
    # + name - the input string name
    # + return - string name with hello message or error
    resource function get greeting(string name) returns string|error {
        // Send a response back to the caller.
        if name is "" {
            return error("name should not be empty!");
        }
        return "Hello, " + name;
    }
}

function sendEmails(Product r) returns error? {
    // get the subscription list for the product
    string[] emails = check getSubscribersOf(r.id);
    foreach string email in emails {
        // send email to the subscriber
        io:println(string `Sending email to ${email}`);
        string|error result = sendemailEp->sendEmail(email, "Price lowered", string `The price of ${r.title} has been lowered to ${r.unit_price}`);
        if result is error {
            return result;
        } else {
            io:println(string `Email sent to ${email}`);
        }
    }
    return ();
}




// Database operations

configurable DatabaseConfig dbConfigCKDB = ?;

function addProductToDatabase(Product product) returns error? {
    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery insertQuery = `INSERT INTO item_catalog (title, description, includes, inc_for, color, material, unit_price) VALUES (${product.title}, ${product.description}, ${product.includes}, ${product.inc_for}, ${product.color}, ${product.material}, ${product.unit_price})`;

    _ = check mysqlEp->execute(insertQuery);

    _ = check mysqlEp.close();
}

function updateProductInDatabase(Product product) returns int|error {

    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery updateQuery = `UPDATE item_catalog SET title = ${product.title}, description = ${product.description}, includes = ${product.includes}, inc_for = ${product.inc_for}, color = ${product.color}, material = ${product.material}, unit_price = ${product.unit_price} WHERE id = ${product.id}`;

    sql:ExecutionResult|sql:Error executionResult = mysqlEp->execute(updateQuery);

    _ = check mysqlEp.close();

    if (executionResult is sql:Error) {
        return executionResult;
    }

    if (executionResult.affectedRowCount == 0) {
        return 0;
    } else {
        return <int>executionResult.affectedRowCount;
    }
}

function deleteProductFromDatabase(int id) returns int|error {
    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery deleteQuery = `DELETE FROM item_catalog WHERE id = ${id}`;

    sql:ExecutionResult|sql:Error executionResult = mysqlEp->execute(deleteQuery);

    _ = check mysqlEp.close();

    if (executionResult is sql:Error) {
        return executionResult;
    }

    if (executionResult.affectedRowCount == 0) {
        return 0;
    } else {
        return <int>executionResult.affectedRowCount;
    }
}

function addToSubscriptionList(int itemId, string email) returns error? {
    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery insertQuery = `INSERT INTO subscription_list (item_id, email) VALUES (${itemId}, ${email})`;

    _ = check mysqlEp->execute(insertQuery);

    _ = check mysqlEp.close();
}

function getSubscribersOf(int itemId) returns string[]|error {
    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery query = `select item_id, email from subscription_list where item_id = ${itemId}`;

    stream<Subscription, sql:Error?> resultStream = mysqlEp->query(query);

    _ = check mysqlEp.close();

    string[] emails = [];

    check from Subscription subscription in resultStream
        do {
            emails.push(subscription.email);
        };

    return emails;
}

function isLessThanPreviousPrice(Product product) returns boolean|error {
    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery query = `select unit_price from item_catalog where id = ${product.id}`;

    float|sql:Error queryRow = mysqlEp->queryRow(query, float);

    _ = check mysqlEp.close();

    if (queryRow is sql:Error) {
        return queryRow;
    } else {
        if (queryRow > product.unit_price) {
            // io:println("Previous price is greater than the new price");
            return true;
        }
        return false;
    }
}
