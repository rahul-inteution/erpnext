# Copyright (c) 2024, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Whatsappchat(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		message: DF.SmallText | None
		naming_series: DF.Literal["WA-.YYYY.-.MM.-.DD."]
		status: DF.Data | None
		to: DF.Data | None
	# end: auto-generated types
	pass
