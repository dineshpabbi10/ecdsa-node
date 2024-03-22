const express = require("express");
const app = express();
const cors = require("cors");
const ethUtils = require("ethereum-cryptography/utils")
const secp256k1 = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const port = 3042;

app.use(cors());
app.use(express.json());

/**
 * Example Keys :
Private Key : a0d64efa75d6adbd2914de9949d98e8f14f78220c26789a7f997f6556cebb869
Public Key 048d696a770da592eaeb839cde66bb548462f784a531cb119caef54c10881139bc966adb87c62b3ed49e4785950e70c39d949695303cab1c3b5ae66320e4181ac5
Private Key : e033691063632f66f11e384d49c2c595bc15bdc5c95091e2deda4e15ff5d9f24
Public Key 0411e295a555d7b7983e531be8272cda206ba43e789643a91c54965d6a78874b87f3cf64c566c22fbd72af4d48253645395963f61d9e36f389a4d16ec938eeb9ea
Private Key : e1dee365109c1a0ad107a648f5de365e90a6c2c7ccfe9f8bb9181d7c2f42b7cd
Public Key 0487fa692a5cbcfb85de1581674ca265bf09953d7825d3e43bf0baa7436f78909a7c4edbb942341b87e91a705af11a784ef06e0c2679f76bc5c624b23f57656836
 */

const balances = {
  "048d696a770da592eaeb839cde66bb548462f784a531cb119caef54c10881139bc966adb87c62b3ed49e4785950e70c39d949695303cab1c3b5ae66320e4181ac5": 100,
  "0411e295a555d7b7983e531be8272cda206ba43e789643a91c54965d6a78874b87f3cf64c566c22fbd72af4d48253645395963f61d9e36f389a4d16ec938eeb9ea": 50,
  "0487fa692a5cbcfb85de1581674ca265bf09953d7825d3e43bf0baa7436f78909a7c4edbb942341b87e91a705af11a784ef06e0c2679f76bc5c624b23f57656836": 75,
};


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port,async () => {
  let signature = await secp256k1.sign(keccak256(ethUtils.utf8ToBytes("")),"a0d64efa75d6adbd2914de9949d98e8f14f78220c26789a7f997f6556cebb869",{});
  console.log(ethUtils.toHex(signature));
  console.log("==============================");
  signature = await secp256k1.sign(keccak256(ethUtils.utf8ToBytes("")),"e033691063632f66f11e384d49c2c595bc15bdc5c95091e2deda4e15ff5d9f24",{});
  console.log(ethUtils.toHex(signature));
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
