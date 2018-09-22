# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.contacts.address_and_contact import load_address_and_contact
import frappe.defaults

class CP58Statement(Document):
	def onload(self):
		self.company=frappe.db.get_single_value('Global Defaults', 'default_company')
		load_address_and_contact(self, "company")