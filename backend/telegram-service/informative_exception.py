class InformativeException(Exception):

    def __init__(self, message="Empty informative exception occurred"):
        self.message = message
        super().__init__(self.message)