# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

import os

# from frappe.model.document import Document
# import ftplib
# import csv
# from frappe.utils import cint, split_emails, get_site_base_path, cstr, today,get_backups_path,get_datetime,get_bench_path,get_files_path
# from six import text_type
# from datetime import datetime, timedelta
# from frappe.utils.background_jobs import enqueue

@frappe.whitelist(allow_guest=True)
def getcomission(sales_person , from_date, to_date):
    return frappe.db.sql("""SELECT
                            sum(total_commission)
                            FROM
                            `tabSales Invoice` AS SI
                            INNER JOIN `tabSales Team` AS ST
                            on ST.parent = SI.name
                            WHERE
                            ST.sales_person =  %s and ifnull(ST.allocated_percentage,0) = 100
                            and SI.posting_date >= %s and posting_date <= %s
                            and SI.status='Paid'
                            and ifnull(SI.base_net_total, 0) > 0 and ifnull(SI.total_commission, 0) > 0""",sales_person,from_date,to_date, as_dict=1) or 0