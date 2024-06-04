# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt


import frappe
from frappe import _
from frappe.utils import flt
from frappe.utils.nestedset import NestedSet, get_root_of


class Territory(NestedSet):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.setup.doctype.target_detail.target_detail import TargetDetail
		from frappe.model.document import Document
		from frappe.types import DF

		countries: DF.TableMultiSelect[Document]
		country: DF.Link | None
		granularity: DF.Literal["Country", "State"]
		is_group: DF.Check
		lft: DF.Int
		old_parent: DF.Link | None
		parent_territory: DF.Link | None
		rgt: DF.Int
		states__cities: DF.TableMultiSelect[Document]
		targets: DF.Table[TargetDetail]
		territory_manager: DF.Link | None
		territory_name: DF.Data
	# end: auto-generated types

	nsm_parent_field = "parent_territory"

	def validate(self):
		if not self.parent_territory:
			self.parent_territory = get_root_of("Territory")

		for d in self.get("targets") or []:
			if not flt(d.target_qty) and not flt(d.target_amount):
				frappe.throw(_("Either target qty or target amount is mandatory"))

	def on_update(self):
		super(Territory, self).on_update()
		self.validate_one_root()


def on_doctype_update():
	frappe.db.add_index("Territory", ["lft", "rgt"])
