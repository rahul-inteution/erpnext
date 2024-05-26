# Import necessary modules
import requests
import frappe
import json
# Define your custom Frappe method
@frappe.whitelist()
def get_locations():
    # Retrieve locations from your database or any other source
    # For example, querying a doctype called 'Location' for latitude and longitude
    locations = frappe.get_all('Lead', fields=['custom_location_in_map', 'name','custom_organization','first_name'])
    
    new_array = []
    
    for i in locations:
        try:
            new_dict = {
                "id": i["name"],
                "coordinates": json.loads(i["custom_location_in_map"])["features"][0]["geometry"]["coordinates"],
                "organization": i["custom_organization"],
                "first_name":i['first_name']
            }
            new_array.append(new_dict)
        except:
            pass
    return new_array

@frappe.whitelist()
def search_location(search_term):

    leads = frappe.get_list('Lead',
                            limit=2000,
                            fields=['name','custom_organization','first_name'],
                            as_list=True
                            )
    
    # organisation_names = [lead["custom_organization"] for lead in leads]
    lead_names = [{lead[0]:lead[2]} for lead in leads]
    data={"search_response":lead_names,"name":search_term}
    response_data = requests.post(
        'https://test.therahul.me/api/core/base/v1/api-test/lead-search/',
        json=data,
        headers={"Content-Type": "application/json"}
    ).json()
    lead = response_data.get('name')
    if lead and lead!="":
        lead = frappe.get_doc('Lead', lead, ['custom_location_in_map'])
        new_doc = {
            "id": lead.name,
            "coordinates": json.loads(lead.custom_location_in_map)["features"][0]["geometry"]["coordinates"],
            "organization": lead.custom_organization
        }
        return [new_doc]
    else:
        locations = requests.get(
            f'https://nominatim.openstreetmap.org/search?q={search_term}&format=json&polygon_kml=1&addressdetails=1'
        )
        new_array = []
        for i in locations.json():
            try:
                new_dict = {
                    "id": "",
                    "coordinates": [i["lon"],i["lat"]],
                    "organization": i["display_name"]
                }
                new_array.append(new_dict)
            except:
                pass
        return new_array

