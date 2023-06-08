"use strict";

const db = require("./db");

const Orders = (order) => {
    this.sellerId = order.sellerId;
    this.buyerId = order.buyerId;
    this.isCart = order.isCart;
    this.status = order.status;
    this.orderTime = order.orderTime;
    this.paymentInfo = order.paymentInfo;
    this.totalPrice = order.totalPrice;
    this.taxes = order.taxes;
    this.shippingFee = order.shippingFee;
    this.finalTotalPay = order.finalTotalPay;
}

//create a new order
Orders.create = (newOrder, result) => {
    db.query("INSERT INTO orders SET ?", newOrder, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        console.log("created order: ", { id: res.insertId, ...newOrder });
        result(null, { id: res.insertId, ...newOrder });
      });
}

//get one order by id
Orders.findById = (id, result) => {

    db.query(`SELECT * FROM orders WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found orders: ", res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    });
};
  
//get all orders with filter generated by controller
Orders.getAll = (filterStr, result) => {
    
    db.query("SELECT * FROM orders" + filterStr ? ` Where ${filterStr}` : "", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        };
        result(null, res);
    });
};

//update an order
Orders.updateById = (id, order, result) => {
    db.query(
        "UPDATE orders SET sellerId=?, buyerId=?, isCart=?, status=?, orderTime=?, paymentInfo=?, totalPrice=?, taxes=?, shippingFee=?, finalTotalPay=?, WHERE id = ?", [order.sellerId, order.buyerId, order.isCart, order.status, order.orderTime, order.paymentInfo, order.totalPrice, order.taxes, order.shippingFee, order.finalTotalPay],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            //problem affectedRows
            if (res.affectedRows == 0) {
                // not found todo with the id
                result({ kind: "not_found" }, null);
                return;
            }
    
            console.log("updated order: ", { id: id, ...order });
            result(null, { id: id, ...order });
        }
    );
};


//delete an order
Orders.remove = (id, result) => {
    db.query("DELETE FROM orders WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
  
        if (res.affectedRows == 0) {
            // not found order with the id
            result({ kind: "not_found" }, null);
            return;
        }
  
        console.log("deleted order with id: ", id);
        result(null, res);
    });
};
  