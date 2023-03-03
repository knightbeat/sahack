
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/graphql;
import ballerina/sql;
import ballerina/http;

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

public distinct service class PetstoreProduct {
    private final readonly & Product product;

    function init(Product product) {
        self.product = product.cloneReadOnly();
    }

    resource function get id() returns int {
        return self.product.id;
    }

    resource function get title() returns string {
        return self.product.title;
    }

    resource function get description() returns string {
        return self.product.description;
    }

    resource function get includes() returns string {
        return self.product.includes;
    }

    resource function get inc_for() returns string {
        return self.product.inc_for;
    }

    resource function get color() returns string {
        return self.product.color;
    }

    resource function get material() returns string {
        return self.product.material;
    }

    resource function get unit_price() returns float {
        return self.product.unit_price;
    }
}

configurable DatabaseConfig dbConfigCKDB = ?;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowHeaders: ["Authorization", "Content-Type", "SOAPAction"],
        exposeHeaders: ["Content-Length", "Content-Type"],
        maxAge: 86400
    }
}
service /petstore on new graphql:Listener(9000) {

    resource function get all() returns PetstoreProduct[]|error {

        Product[] products = check getProducts(); //item_catalog.toArray().cloneReadOnly();

        return products.'map(entry => new PetstoreProduct(entry));
    }

    resource function get filter(int id) returns PetstoreProduct?|error {

        Product[] products = check getProducts();

        Product? product = products[id];

        if (product is Product) {
            return new PetstoreProduct(product);
        }

        return ();
    }
}

function getProducts() returns Product[]|error {

    mysql:Client mysqlEp = check new (
            host = dbConfigCKDB.host,
    user = dbConfigCKDB.user,
    password = dbConfigCKDB.password,
    database = dbConfigCKDB.database,
    port = dbConfigCKDB.port);

    sql:ParameterizedQuery query = `select id, title, description, includes, inc_for, color, material, unit_price from item_catalog`;

    stream<Product, sql:Error?> queryResult = mysqlEp->query(query);

    Product[] products = [];
    check from Product product in queryResult
        do {
            products.push(product);
        };
    return products;
}
