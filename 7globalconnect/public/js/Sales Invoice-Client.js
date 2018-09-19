cur_frm.cscript.custom_before_save = function (doc) {
        var commission_type
        var item_commission_rate
        var Item_commission_amount = 0
        doc.salesperson_total_commission = 0

        //get field name as per commission type
        if (doc.commission_type == "Initial Sales") {
            commission_type = "initial_sales_commission"
        } else if (doc.commission_type == "Yearly Renewal") {
            commission_type = "yearly_renewal_commission"
        } else if (doc.commission_type == "Referral Fees- Initial Sales") {
            commission_type = "referral_fees"
        }
        frappe.run_serially([
            () => { //loop through child table
                $.each(doc.items || [], function (i, v) {
                    frappe.run_serially([
                        () => {
                            frappe.call({
                                method: 'frappe.client.get_value',
                                args: {
                                    'doctype': 'Item',
                                    'filters': {
                                        'item_code': v.item_code
                                    },
                                    'fieldname': [
                                        commission_type,
                                    ]
                                },
                                callback: function (r) {
                                    if (!r.exc) {
                                        if (r.message) {
                                            rate = Object.values(r.message)[0]
                                            frappe.model.set_value(v.doctype, v.name, "commission_rate", rate)
                                        }
                                    }
                                }
                            })
                        },
                        () => {
                            console.log('net_base_amount')
                            console.log(v.base_net_amount)
                            console.log('commission_rate')
                            console.log(v.commission_rate)

                            if (v.base_net_amount && v.commission_rate) {


                                Item_commission_amount = (v.base_net_amount * (v.commission_rate / 100)) + Item_commission_amount
                                doc.salesperson_total_commission = Item_commission_amount
                                frappe.model.set_value(doc.doctype, doc.name, "salesperson_total_commission", Item_commission_amount)
                                console.log('Item_commission_amount')
                                console.log(Item_commission_amount)
                            }

                        }
                    ]);
                })
            },
            () => {
                doc.salesperson_total_commission = Item_commission_amount
                console.log('Item_commission_amount')
                console.log(Item_commission_amount)
                cur_frm.refresh_field('items');
                cur_frm.refresh_field('salesperson_total_commission');
            }
        ]);
    },
    frappe.ui.form.on("Sales Invoice", {

        commission_type: function (frm, cdt, cdn) {
            if (frm.doc.commission_type == "Initial Sales") {
                frm.add_fetch("item_code", "initial_sales_commission", "commission_rate");
            } else if (frm.doc.commission_type == "Yearly Renewal") {
                frm.add_fetch("item_code", "yearly_renewal_commission", "commission_rate");
            } else if (frm.doc.commission_type == "Referral Fees- Initial Sales") {
                frm.add_fetch("item_code", "referral_fees", "commission_rate");
            }
        }
    });