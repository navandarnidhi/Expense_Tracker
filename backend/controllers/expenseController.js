const Expense = require("../models/Expense");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err });
  }
};

exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  const { icon, category, amount, date } = req.body;

  try {
    if (!category || !amount || !date) {
      res.status(400).json({ msg: "All the fields are required" });
      return;
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json({ msg: `${newExpense.category} successfully added` });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err });
  }
};

exports.downloadExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expense");

    // Add header row
    worksheet.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    // Add data rows
    expense.forEach((item) => {
      worksheet.addRow({
        category: item.category,
        amount: item.amount,
        date: item.date,
      });
    });

    // Save file to disk
    const filePath = path.join(__dirname, "../Expense_details.xlsx");
    await workbook.xlsx.writeFile(filePath);

    // Send file for download
    res.download(filePath, "Expense_details.xlsx", (err) => {
      // Delete file after sending
      fs.unlink(filePath, () => {});
      if (err) {
        res.status(500).json({ msg: "Error downloading file", error: err });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err });
  }
};
