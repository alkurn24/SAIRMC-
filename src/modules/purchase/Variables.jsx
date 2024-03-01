const inquiryDashboardData = [
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" }
]

const quotationDashboardData = [
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" }
]

var ordersDashboardData = [
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" },
  { qty: "100", value: "1,00,111" }
]

var inquiriesData = [
  { number: "Template", date: "", customer: "", email: "", phone: "", product: "", quantity: "", value: "", status: "" },
  { number: "I2007201801", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201802", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 156.50, discount: 5, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "I2007201803", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 10, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201804", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "I2007201805", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201806", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "I2007201807", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201808", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "I2007201809", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201810", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "I2007201811", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201812", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "I2007201813", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "I2207201814", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
];

var quotationData = [
  { number: "Template", date: "", customer: "", email: "", phone: "", product: "", quantity: "", value: "", status: "" },
  { number: "Q2007201801", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201802", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 156.50, discount: 5, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "Q2007201803", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 10, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201804", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "Q2007201805", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201806", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "Q2007201807", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201808", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "Q2007201809", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201810", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "Q2007201811", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201812", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
  { number: "Q2007201813", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, value: "1000 ₹", status: "new" },
  { number: "Q2207201814", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, value: "1099 ₹", status: "new" },
];

var ordersData = [
  { number: "Template", date: "", customer: "", email: "", phone: "", product: "", quantity: "", value: "", status: "" },
  { number: "O2007201801", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201802", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
  { number: "O2007201803", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201804", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
  { number: "O2007201805", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201806", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
  { number: "O2007201807", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201808", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
  { number: "O2007201809", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201810", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
  { number: "O2007201811", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201812", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
  { number: "O2007201813", date: "11-Jul-2018", customer: "Customer 1", email: "customer1@gmail.com", phone: "+91 123456", product: "Cone 1", rate: 100, discount: 0, quantity: 100, status: "new" },
  { number: "O2207201814", date: "21-Jul-2018", customer: "Customer 2", email: "customer2@gmail.com", phone: "+91 123456", product: "Cone 2", rate: 100, discount: 0, quantity: 98, status: "new" },
];

module.exports = {
  inquiryDashboardData,
  quotationDashboardData,
  ordersDashboardData,
  inquiriesData,
  quotationData,
  ordersData
}