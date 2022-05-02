package umm3601.shoppinglist;

import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Projections;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

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
                        .append("productId", "$productData._id")
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

  public void resetShoppingList(Context ctx) {
    // placeholder method for the shoppinglist generation
    ctx.json(null);
  }

  /**
   * Validate then add a received shoppinglist item to the shoppinglist collection
   *
   * @param ctx a Javalin HTTP context
   */
  @SuppressWarnings({ "MagicNumber" })
  public void addNewShoppingListItem(Context ctx) {

    ShoppingListItem newShoppingListItem = ctx.bodyValidator(ShoppingListItem.class)
        .check(item -> productExists(item.productId), "error: product does not exist")
        .check(item -> ObjectId.isValid(item.productId), "The product id is not a legal Mongo Object ID.")
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
}
