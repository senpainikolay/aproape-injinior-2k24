
from datetime import datetime


class ImageExtractedDataStateManager:
    def __init__(self, entity, total, payment_method,date,address,modify_state=""):
        self.entity  = entity
        self.total = total
        self.payment_method = payment_method
        self.date = date
        self.address = address
        self.modify_state = modify_state

    
    def check_input_and_change_state(self,txt):
        if txt in ['Entity', 'Total', 'Payment Method', 'Date', 'Address']:
            self.modify_state = txt.lower().replace(" ", "_")
            return True
        return False
    
    def check_and_modify_data_on_state(self,new_val):
        if self.modify_state == "entity":
            self.entity = new_val
            return True
        elif self.modify_state == "total":
            self.total = new_val
            return True
        elif self.modify_state == "payment_method":
            self.payment_method = new_val
            return True
        elif self.modify_state == "date":
            self.date = new_val
            return True
        elif self.modify_state == "address":
            self.address = new_val
            return True
        else:
            return False

    def reset_state(self):
        self.modify_state = ""


    def to_dict(self):
        return {
            'entity': self.entity,
            'total': self.total,
            'payment_method': self.payment_method,
            'date' : self.date,
            'address' : self.address,
            'modify_state' : self.modify_state

        }
    
    def to_transaction_entity(self):
        return {
            "amount": self.total,
            "datetime": datetime.now(),
            "payee": self.entity,
            "description": "",
            "location": self.address,
            "transaction_type_id": "fd9bf026-338a-4372-bd48-8509a47e877c" 
        }
    
    def to_user_ui(self):
        return f'Entity: {self.entity}\nTotal: {self.total}\nPayment Method: {self.payment_method}\nDate: {self.date}\nAddress: {self.address}'

    @classmethod
    def from_api_dict(cls, data):
        return cls(data['entity'], data['total'], data['payment_method'],data['date'],data['address'])
    
    @classmethod
    def from_redis_dict(cls, data):
        return cls(data['entity'], data['total'], data['payment_method'],data['date'],data['address'],data['modify_state'])