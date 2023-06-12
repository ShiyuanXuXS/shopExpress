var myParam = "";
let sessionUsername = sessionStorage.getItem("username");
let sessionPassword = sessionStorage.getItem("password");
let sellerId = sessionStorage.getItem("id");
let role = sessionStorage.getItem("role");

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  myParam = urlParams.get("productId");
  console.log(myParam);
  refreshProducDetail();
});

function refreshProducDetail() {
  $.ajax({
    url: `/api/products/${myParam}`,
    type: "GET",
    async: false,
    dataType: "json",
    error: function (jqxhr, status, errorThrown) {
      alert("AJAX error: " + jqxhr.responseText);
    },
    success: function (response) {
      console.log("productId is : " + myParam);
      var result = "";
      console.log(response);
      var product = response;

      var imagepath;
      var imageId = product.image_id;
      if (imageId) {
        imagepath = `api/images/${imageId}`;
      } else {
        // Handle case when no images are returned
        imagepath = "api/images/38";
      }

      // insert to the DOM
      result +=
        `<div class="col-md-6"><img id="imageUrl" class="card-img-top mb-5 mb-md-0" src="` +
        imagepath +
        `" alt="productImage" /></div>
      <div class="col-md-6">
          <div id="productCode" class="small mb-1">product code: ` +
        product.productCode +
        `</div>
      
          <h1 id="productName" class="display-5 fw-bolder">` +
        product.productName +
        `</h1>
          <div id="sellerId" class="small mb-1">sellerId: ` +
        product.sellerId +
        `</div>
          <div class="fs-5 mb-5">
              <span id="productPrice">$` +
        product.price +
        `</span>
          </div>
          <p id="productDesc" class="lead">` +
        product.productDesc +
        ` </p>
          <div class="d-flex">
              <input class="form-control text-center me-3" id="inputQuantity" type="num" value="1" style="max-width: 3rem" name="inputQuantity" />
              <button id="addToCart"class="btn btn-warning flex-shrink-0" type="button">
                  <i class="bi-cart-fill me-1"></i>
                  Add to cart
              </button>
          </div>
      </div>`;

      $("#productContainer").html(result);

      $("#addToCart").on("click", function () {
        var selectedQuantity = $("input[name=inputQuantity]").val();
        console.log("Selected Quantity: ", selectedQuantity);
        $.ajax({
          url: `/api/carts`,
          type: "POST",
          headers: {
            "x-auth-username": sessionUsername,
            "x-auth-password": sessionPassword,
            "x-auth-role": role,
          },
          data: {
            amount: selectedQuantity,
            id: product.id,
          },
          success: function (response) {
            $("#myModalBody").html("Product added to cart successfully!");
            $("#myModal").modal("show");
            console.log("Product added to cart successfully!");
          },
          error: function (error) {
            $("#myModalBody").html("Error adding product to cart");
            $("#myModal").modal("show");
            console.log("Error adding product to cart:", error);
          },
        });
      });
    },
  });
}
