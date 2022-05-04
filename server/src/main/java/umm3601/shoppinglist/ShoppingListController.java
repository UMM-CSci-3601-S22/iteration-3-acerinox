package umm3601.shoppinglist;

import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Variable;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.bson.conversions.Bson;
import org.bson.UuidRepresentation;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import umm3601.product.Product;

public class ShoppingListController {

  private final JacksonMongoCollection<ShoppingListItem> shoppingListCollection;
  private final JacksonMongoCollection<Product> productCollection;

  public ShoppingListController(MongoDatabase database) {
    shoppingListCollection = JacksonMongoCollection.builder().build(
        database,
        "shoppingList",
        ShoppingListItem.class,
        UuidRepresentation.STANDARD);

    productCollection = JacksonMongoCollection.builder().build(
        database,
        "products",
        Product.class,
        UuidRepresentation.STANDARD);
  }

  public void getAllShoppingListDisplayItems(Context ctx) {
    ArrayList<ShoppingListStoreGroup> returnedShoppingListItems = shoppingListCollection
        .aggregate(
            Arrays.asList(
                Aggregates.lookup("products", "product", "_id", "productData"),
                Aggregates.unwind("$productData"),
                Aggregates.group("$productData.store", Accumulators.addToSet("products",
                    new Document("_id", "$_id")
                        .append("product", "$productData._id")
                        .append("productName", "$productData.productName")
                        .append("brand", "$productData.brand")
                        .append("location", "$productData.location")
                        .append("count", "$count"))),
                Aggregates.project(Projections.fields(
                    Projections.computed("store", "$_id"),
                    Projections.include("products"),
                    Projections.excludeId())),
                Aggregates.sort(ascending("store"))),
            ShoppingListStoreGroup.class)
        .into(new ArrayList<>());

    ctx.json(returnedShoppingListItems);
  }

  public void resetShoppingList(Context ctx) {

    List<Variable<String>> let = new ArrayList<>(
        Arrays.asList(
            new Variable<String>("productId", "$_id"),
            new Variable<String>("productThreshold", "$threshold")));

    String compareCommand = " {$and: [ { $eq: [\"$_id\", \"$productId\"] },"
        + " { $lt: [ \"$count\", \"$productThreshold\" ] } ]  } ";

    ArrayList<ResetShoppingListItem> output = productCollection.aggregate(
        Arrays.asList(
            Aggregates.lookup("pantry",
                let,
                new ArrayList<Bson>(Arrays.asList(
                    Aggregates.group("$product", Accumulators.sum("count", 1)),
                    Aggregates.project(
                        Projections.fields(Projections.include("count"),
                            Projections.computed("productId", "$$productId"),
                            Projections.computed("productThreshold", "$$productThreshold"))),
                    Aggregates.match(Filters.expr(Document.parse(compareCommand))))),
                "outputProducts")),
        ResetShoppingListItem.class).into(new ArrayList<>());

    List<ShoppingListItem> convertedOutput = output.stream().map(ShoppingListController::convertQueryOutput)
        .filter(item -> item.count > 0)
        .collect(Collectors.toList());

    shoppingListCollection.drop();
    shoppingListCollection.insertMany(convertedOutput);

    ctx.json(convertedOutput);
  }

  private static ShoppingListItem convertQueryOutput(ResetShoppingListItem item) {
    ShoppingListItem output = new ShoppingListItem();
    output.product = new ObjectId(item._id).toHexString();
    if (item.outputProducts.size() > 0) {
      int inventoryDifference = item.threshold - item.outputProducts.get(0).count;
      output.count = inventoryDifference > 0 ? inventoryDifference : 0;
    } else {
      output.count = item.threshold;
    }
    return output;
  }

  /**
   * Checks if the given entry exists with a given id. if no such entry exists
   * returns false. Returns true for one or more entry with a matching
   * id.
   *
   * @param id
   * @return boolean - true if one or more functions with matching names exit.
   */
  private boolean productExists(String id) {
    Product product;

    try {
      product = productCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      return false;
    }
    if (product == null) {
      return false;
    }
    return true;
  }


  /**
   * Validate then add a received shoppinglist item to the shoppinglist collection
   *
   * @param ctx a Javalin HTTP context
   */

  public void addNewShoppingListItem(Context ctx) {

    ShoppingListItem newShoppingListItem = ctx.bodyValidator(ShoppingListItem.class)
        .check(item -> productExists(item.product), "error: product does not exist")
        .check(item -> ObjectId.isValid(item.product), "The product id is not a legal Mongo Object ID.")
        .check(item -> item.count >= 1,
            "Shopping list item count cannot be 0")
        .get();

    shoppingListCollection.insertOne(newShoppingListItem);

    // 201 is the HTTP code for when we successfully
    // create a new resource (a pantry item in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpCode.CREATED);
    ctx.json(Map.of("id", newShoppingListItem._id));
  }

  public void productInShoppingList(Context ctx) {
    Boolean exists;
    String productId = ctx.pathParam("id");

    try {
      if (shoppingListCollection.find(eq("product", new ObjectId(productId))).first() == null) {
        exists = false;
      } else {
        exists = true;
      }
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested product id wasn't a legal Mongo Object ID.");
    }
    ctx.json(Map.of("exists", exists));

  }
}
