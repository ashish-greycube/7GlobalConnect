frappe.ui.form.on("CP58 Statement", {
    statement_for: function (frm, cdt, cdn) {
        if (frm.doc.statement_for == "Monthly") {
            frm.doc.from_date=frappe.datetime.month_start()
            frm.doc.to_date=frappe.datetime.month_end()
            frm.doc.period=moment().format('MMM YYYY')
        } else if (frm.doc.statement_for == "Yearly") {
            frm.doc.from_date=moment().subtract(1, 'year').startOf("year").format()
            frm.doc.to_date=moment().subtract(1, 'year').endOf("year").format()
            frm.doc.period=new Date(moment().subtract(1, 'year').toDate()).getFullYear()
            
        }
        frm.refresh_field('from_date');
        frm.refresh_field('to_date');
        frm.refresh_field('period');

        frappe.call({
            method: '7globalconnect.api.getcomission',
            args: {
                sales_person:frm.doc.sales_person ,
                from_date: frm.doc.from_date,
                to_date: frm.doc.to_date
            },
            callback: function (r) {
                if (r.message) {
                    data = r.message
                    console.log(data)
                    if (data.commission){
                        frm.doc.total_commission=data.commission
                    }else{
                        frm.doc.total_commission=0
                    }
                    frm.refresh_field('total_commission');
                    
                }
            }
        });


    }
});