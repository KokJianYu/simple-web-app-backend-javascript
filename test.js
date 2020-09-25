var chai = require("chai");
var chaiHttp = require("chai-http");
var backend_api = "http://localhost:8080";

const { expect } = chai;
chai.use(chaiHttp);

describe("CRUD Test", function () {
  describe("Get test", function () {
    it("Should get an empty flashcards array", (done) => {
      chai
        .request(backend_api)
        .get("/flashCard")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.flashcards).to.be.an("array").that.is.empty;
          done();
        });
    });
  });

  var id;
  describe("Add/Post test", function () {
    it("Should add a flashcard", (done) => {
      chai
        .request(backend_api)
        .post("/flashCard")
        .set("Content-Type", "application/json")
        .send({ behind: "professor", front: "profesora" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.info).to.equal("flashCard profesora,professor added");
          id = res.body.id;
          done();
        });
    });

    it("Check if added flashcard exist", (done) => {
      chai
        .request(backend_api)
        .get("/flashCard")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.flashcards).to.deep.include([
            id,
            "profesora",
            "professor",
          ]);
          done();
        });
    });
  });

  describe("Edit/Put test", function () {
    it("Should edit existing flashcard", (done) => {
      chai
        .request(backend_api)
        .put("/flashCard")
        .set("Content-Type", "application/json")
        .send({ id: id, behind: "chair", front: "silla" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.info).to.equal(`flashCard ${id} modified`);
          done();
        });
    });

    it("Check if added flashcard exist", (done) => {
      chai
        .request(backend_api)
        .get("/flashCard")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.flashcards).to.deep.not.include([
            id,
            "profesora",
            "professor",
          ]);
          expect(res.body.flashcards).to.deep.include([id, "silla", "chair"]);
          done();
        });
    });
  });

  describe("Delete test", function () {
    it("Should delete existing flashcard", (done) => {
      chai
        .request(backend_api)
        .delete("/flashCard")
        .set("Content-Type", "application/json")
        .query({ id: id })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.info).to.equal(`flashCard ${id} has been removed`);
          done();
        });
    });

    it("Check if flashcard is deleted", (done) => {
      chai
        .request(backend_api)
        .get("/flashCard")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.flashcards).to.deep.not.include([
            id,
            "silla",
            "chair",
          ]);
          done();
        });
    });
  });
});
