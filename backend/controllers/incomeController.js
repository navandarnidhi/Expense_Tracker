const ExcelJS = require("exceljs");
const Income = require("../models/Income");
const path = require("path");
const fs = require("fs");

exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  const { icon, source, amount, date } = req.body;
  try {
    if (!amount || !source || !date) {
      return res.status(400).json({
        msg: "All the fields are required",
      });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err });
  }
};

exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Income");

    worksheet.columns = [
      { header: "Source", key: "source", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    income.forEach((item) => {
      worksheet.addRow({
        source: item.source,
        amount: item.amount,
        date: item.date,
      });
    });

    const filePath = path.join(__dirname, "../income_details.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, "income_details.xlsx", (err) => {
      fs.unlink(filePath, () => {});
      if (err) {
        res.status(500).json({
          msg: "Server Error",
          error: err,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
      error: err,
    });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Item Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err });
  }
};