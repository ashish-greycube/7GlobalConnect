// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt
frappe.ui.form.on("CP58 Statement", {

    company: function (frm) {
        frappe.call({
            "method": "frappe.client.get_value",
            args: {
                doctype: "Company",
                fieldname: "payer_officer",
                filters: {
                    company_name: ["=", frm.doc.company]
                }
            },
            callback: function (r) {
                data=r.message
                if (data) {
                    frm.set_value("payer_officer_emp_id", data.payer_officer) 
                }
            }
        });
        frappe.call({
            "method": "7globalconnect.sevenglobalconnect.doctype.cp58_statement.cp58_statement.get_company_address",
            args: {
                company: frm.doc.company
            },
            callback: function (r) {
                data=r.message[0]
                if (data) {
                    company_address=data.address_line1+"\n"+data.address_line2+"\n"+data.city+"\n"+data.pincode+"\n"+data.country
                    frm.set_value("company_address",company_address)
                }
            }
        });

    },
    payer_officer_emp_id: function (frm) {
        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Employee",
                filters: {
                    name: ["=", frm.doc.payer_officer_emp_id]
                },
                fieldname: ["employee_name", "designation", "passport_number"]
            },
        }).then(function (r) {
            if (r.message) {
                frm.set_value("officer_name", r.message.employee_name)
                frm.set_value("officer_passport", r.message.passport_number)
                frm.set_value("officer_designation", r.message.designation)
            }
        })

    },

    sales_person: function (frm) {
        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Employee",
                filters: {
                    employee_name: ["=", frm.doc.sales_person]
                },
                fieldname: ["prefered_email", "permanent_address", "passport_number", "is_malaysian_resident"]
            },
        }).then(function (r) {
            if (r.message) {
                frm.set_value("sales_person_email", r.message.prefered_email)
                frm.set_value("sales_person_address", r.message.permanent_address)
                frm.set_value("sales_person_passport", r.message.passport_number)
                frm.set_value("is_malyasian_resident", r.message.is_malaysian_resident)
            }
        })
    },
    statement_for: function (frm, cdt, cdn) {
        if (frm.doc.statement_for == "Monthly") {
            frm.doc.from_date = frappe.datetime.month_start()
            frm.doc.to_date = frappe.datetime.month_end()
            frm.doc.period = moment().format('MMM YYYY')
        } else if (frm.doc.statement_for == "Yearly") {
            frm.doc.from_date = moment().subtract(1, 'year').startOf("year").format()
            frm.doc.to_date = moment().subtract(1, 'year').endOf("year").format()
            frm.doc.period = new Date(moment().subtract(1, 'year').toDate()).getFullYear()

        }
        frm.refresh_field('from_date');
        frm.refresh_field('to_date');
        frm.refresh_field('period');
        frm.trigger('set_total_commission');
    },
    from_date: function (frm) {
        frm.trigger('set_total_commission');
    },
    to_date: function (frm) {
        frm.trigger('set_total_commission');
    },
    set_total_commission: function (frm) {
        frappe.call({
            method: '7globalconnect.api.getcomission',
            args: {
                sales_person: frm.doc.sales_person,
                from_date: frm.doc.from_date,
                to_date: frm.doc.to_date
            },
            callback: function (r) {
                if (r.message) {
                    data = r.message
                    if (data[0].commission) {
                        frm.doc.total_commission = data[0].commission
                    } else {
                        frm.doc.total_commission = 0
                    }
                    frm.refresh_field('total_commission');

                }
            }
        });

    },
    validate: function (frm) {

    }

});
