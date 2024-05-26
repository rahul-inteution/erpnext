import frappe
from thefuzz import fuzz
# Define your custom Frappe method
@frappe.whitelist()
def check_organization(**args):
    name = args['organization']
    match_dict = {}
    search_response = frappe.get_list('Organization', fields=['organization_name'])
    for org in search_response:
        score = fuzz.ratio(name, org.name)
        match_dict[org.name] = score
        
    sorted_matches = sorted(match_dict.items(), key=lambda x: x[1], reverse=True)
    if sorted_matches and sorted_matches[0][1] > 60:
        return sorted_matches[0][0]
    else:
        return ""
 
