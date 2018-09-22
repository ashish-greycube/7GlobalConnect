frappe.ui.form.on("Domain Registration", {
    sales_order: function (frm) {
        frm.add_fetch("sales_order", "customer", "customer");
        frm.add_fetch("sales_order", "customer_name", "customer_name");
        frm.add_fetch("sales_order", "customer_address", "customer_address");
        frm.add_fetch("sales_order", "address_display", "address_display");
        frm.add_fetch("sales_order", "contact_person", "contact_person");
        frm.add_fetch("sales_order", "contact_mobile", "contact_mobile");
        frm.add_fetch("sales_order", "contact_display", "contact_display");
        frm.add_fetch("sales_order", "contact_email", "contact_email");
        frm.add_fetch("sales_order", "transaction_date", "purchase_date");

    },
    purchase_date: function (frm) {
        frm.set_value("expiry_date", frappe.datetime.add_months(frm.doc.purchase_date, 12));
    },
    employee: function (frm) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                'doctype': 'Employee',
                'filters': {
                    'name': frm.doc.employee
                },
                'fieldname': [
                    'prefered_email','cell_number'
                ]
            },
            callback: function (r) {
                if (!r.exc) {
                    if (r.message) {
                        data=r.message
                        frm.set_value("prefered_email", data.prefered_email)
                        frm.set_value("sales_person_cell", data.cell_number)
                    }
                }
            }
        })
    }
});