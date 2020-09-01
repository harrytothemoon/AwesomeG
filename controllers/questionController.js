const questionController = {
  getQuestions: (req, res) => {
    res.send('hello teacher!')
  },
  getMyQuestions: (req, res) => {
    res.send('hello student!')
  },
}
module.exports = questionController