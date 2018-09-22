# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.contacts.address_and_contact import load_address_and_contact
import frappe.defaults

class CP58Statement(Document):
	pass

@frappe.whitelist()
def get_company_address(company):
		# company=frappe.db.get_single_value('Global Defaults', 'default_company')

		filters = [
			["Dynamic Link", "link_doctype", "=", "Company"],
			["Dynamic Link", "link_name", "=", company],
			["Dynamic Link", "parenttype", "=", "Address"],
		]
		address_list = frappe.get_all("Address", filters=filters, fields=["*"])

		address_list = sorted(address_list,
			lambda a, b:
				(int(a.is_primary_address - b.is_primary_address)) or
				(1 if a.modified - b.modified else 0), reverse=True)
		# print address_list
		return address_list
