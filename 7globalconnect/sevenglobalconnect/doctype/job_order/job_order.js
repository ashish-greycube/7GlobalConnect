// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Job Order", {
    sales_order: function (frm) {
        frm.add_fetch("sales_order", "customer", "customer");
        frm.add_fetch("sales_order", "customer_name", "customer_name");
        frm.add_fetch("sales_order", "customer_address", "customer_address");
        frm.add_fetch("sales_order", "address_display", "address_display");
        frm.add_fetch("sales_order", "contact_person", "contact_person");
        frm.add_fetch("sales_order", "contact_mobile", "contact_mobile");
        frm.add_fetch("sales_order", "contact_display", "contact_display");
        frm.add_fetch("sales_order", "contact_email", "contact_email");
        frm.add_fetch("sales_order", "delivery_date", "delivery_date");
    }
});
