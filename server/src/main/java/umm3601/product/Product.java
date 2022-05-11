package umm3601.product;

//import java.awt.Image;
import java.util.ArrayList;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier" })
public class Product {

  @ObjectId
  @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  @SuppressWarnings({ "MemberName" })
  public String _id;
  public String productName;
  public String description;
  public String brand;
  public String category;
  public String store;
  public String location;
  public String notes;
  public ArrayList<String> tags;
  public int lifespan;
  public int threshold;
  public String image;
}
