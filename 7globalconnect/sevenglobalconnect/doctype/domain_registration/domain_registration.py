# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class DomainRegistration(Document):
	pass

@frappe.whitelist()
def get_sales_person_for_sales_order(salesorder_no):
	 return frappe.db.sql("""select sales_person from `tabSales Team` where allocated_percentage=100 and parenttype='Sales Order' and parentfield='sales_team'
and parent=%s""",salesorder_no,as_dict=1)
