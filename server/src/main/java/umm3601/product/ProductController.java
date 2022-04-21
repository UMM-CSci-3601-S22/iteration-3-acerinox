package umm3601.product;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;

public class ProductController {
  private static final String PRODUCT_NAME_KEY = "productName";
  // private static final String DESCRIPTION_KEY = "description";
  private static final String BRAND_KEY = "brand";
  private static final String CATEGORY_KEY = "category";
  private static final String STORE_KEY = "store";
  // private static final String LOCATION_KEY = "location";
  // private static final String NOTES_KEY = "notes";
  // private static final String TAGS_KEY = "tags";
  // private static final String LIFESPAN_KEY = "lifespan";
  // private static final String THRESHOLD_KEY = "threshold";

  private final JacksonMongoCollection<Product> productCollection;

  public ProductController(MongoDatabase database) {
    productCollection = JacksonMongoCollection.builder().build(
        database,
        "products",
        Product.class,
        UuidRepresentation.STANDARD);
  }

  /**
   * Get the single product specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getProductByID(Context ctx) {
    String id = ctx.pathParam("id");
    Product product;

    try {
      product = productCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested product id wasn't a legal Mongo Object ID.");
    }
    if (product == null) {
      throw new NotFoundResponse("The requested product was not found");
    } else {
      ctx.json(product);
    }
  }

  /**
   * Get a JSON response with a list of all the products.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getAllProducts(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the products with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<Product> matchingProducts = productCollection
        .find(combinedFilter)
        .sort(sortingOrder)
        .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of products returned by
    // the database.
    ctx.json(matchingProducts);
  }

  public void groupProductsByCategory(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    ArrayList<CategorySortItem> output = productCollection
        .aggregate(
            Arrays.asList(
                Aggregates.match(combinedFilter),
                Aggregates.sort(sortingOrder),
                Aggregates.group("$category",
                    Accumulators.sum("count", 1),
                    Accumulators.addToSet("products",
                        new Document("_id", "$_id")
                            .append("brand", "$brand")
                            .append("description", "$description")
                            .append("image", "$image")
                            .append("lifespan", "$lifespan")
                            .append("location", "$location")
                            .append("notes", "$notes")
                            .append("productName", "$productName")
                            .append("store", "$store")
                            .append("tags", "$tags")
                            .append("threshold", "$threshold"))),
                Aggregates.project(
                    Projections.fields(
                        Projections.computed("category", "$_id"),
                        Projections.include("count", "products"),
                        Projections.excludeId()))),
            CategorySortItem.class)
        .into(new ArrayList<>());

    ctx.json(output);

  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(PRODUCT_NAME_KEY)) {
      filters.add(regex(PRODUCT_NAME_KEY, Pattern.quote(ctx.queryParam(PRODUCT_NAME_KEY)), "i"));
    }
    /*
     * if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
     * filters.add(regex(DESCRIPTION_KEY,
     * Pattern.quote(ctx.queryParam(DESCRIPTION_KEY)), "i"));
     * }
     */

    if (ctx.queryParamMap().containsKey(BRAND_KEY)) {
      filters.add(regex(BRAND_KEY, Pattern.quote(ctx.queryParam(BRAND_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
      filters.add(regex(CATEGORY_KEY, Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(STORE_KEY)) {
      filters.add(regex(STORE_KEY, Pattern.quote(ctx.queryParam(STORE_KEY)), "i"));
    }

    // Combine the list of filters into a single filtering document.
    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    // Sort the results. Use the `sortby` query param (default "PRODUCT_NAME_KEY")
    // as the field to sort by, and the query param `sortorder` (default
    // "asc") to specify the sort order.
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), PRODUCT_NAME_KEY);
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  /**
   * Get a JSON response with a list of all the products.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewProduct(Context ctx) {

    Product newProduct = validateProduct(ctx);

    productCollection.insertOne(newProduct);

    // 201 is the HTTP code for when we successfully
    // create a new resource (a user in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpCode.CREATED);
    ctx.json(Map.of("id", newProduct._id));
  }

  /**
   * Delete the user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteProduct(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = productCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the system?");
    }
  }

  private Product validateProduct(Context ctx) {
    return ctx.bodyValidator(Product.class)
        .check(product -> product.productName != null && product.productName.length() > 0,
            "Product must have a non-empty product name")
        .check(product -> product.description != null,
            "Product description cannot be null")
        .check(product -> product.brand != null && product.brand.length() > 0, "Product must have a non-empty brand")
        // .check(product -> product.category.matches("^(admin|editor|viewer)$"), "User
        // must have a legal user role")
        .check(product -> product.category != null && product.category.length() > 0,
            "Product must have a non-empty category")
        .check(product -> product.store != null && product.store.length() > 0, "Product must have a non-empty store")
        .check(product -> product.location != null && product.location.length() > 0,
            "Product must have a non-empty location")
        .check(product -> product.notes != null && product.notes.length() > 0, "Product notes cannot be null")
        // .check(product -> product.tags != null && product.tags.size() >= 0, "Product
        // tags cannot be null")
        .check(product -> product.lifespan >= 0, "Products's lifespan must be greater than or equal to zero")
        .check(product -> product.threshold > 0, "Products's threshold must be greater than zero")
        .get();
  }

  public void editProduct(Context ctx) {

    Product newProduct = validateProduct(ctx);

    String productID = ctx.pathParam("id");

    productCollection.replaceOne(eq("_id", new ObjectId(productID)), newProduct);

    // For some reason, the id here is null, so reset it here for the redirect on
    // client
    newProduct._id = productID;

    // 201 is the HTTP code for when we successfully
    // (PUT a new product)
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpCode.CREATED);
    ctx.json(newProduct);
  }

}
