var chai = require('chai');
var chaiHttp = require('chai-http');
var backend_api = require("./app.js");

const {expect} = chai;
chai.use(chaiHttp);

describe('CRUD Test', function() {
    describe('Get test', function() {
        it("Should get an empty flashcards array", (done) => {
            chai.request(backend_api)
            .get("/flashCard")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.flashcards).to.be.an('array').that.is.empty;
                done();
            });
        });
    });

    describe('Add/Post test', function() {
        it("Should add a flashcard", (done) => {
            chai.request(backend_api)
            .post("/flashCard")
            .set("Content-Type", "application/json")
            .send({"english":"professor","spanish":"profesora"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.info).to.equal("flashCard profesora,professor added");
                done();
            });
        });

        it("Check if added flashcard exist", (done) => {
            chai.request(backend_api)
            .get("/flashCard")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.flashcards).to.deep.include(["profesora","professor"]);
                done();
            });
        });
    });

    describe('Edit/Put test', function() {
        it("Should edit existing flashcard", (done) => {
            chai.request(backend_api)
            .put("/flashCard/0")
            .set("Content-Type", "application/json")
            .send({"english":"chair","spanish":"silla"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.info).to.equal("flashCard 0 is changed to silla,chair");
                done();
            });
        });

        it("Check if added flashcard exist", (done) => {
            chai.request(backend_api)
            .get("/flashCard")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.flashcards).to.deep.not.include(["profesora","professor"]);
                expect(res.body.flashcards).to.deep.include(["silla","chair"]);
                done();
            });
        });
    });

    describe('Delete test', function() {
        it("Should delete existing flashcard", (done) => {
            chai.request(backend_api)
            .delete("/flashCard/0")        
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.info).to.equal("flashCard 0 has been removed");
                done();
            });
        });

        it("Check if flashcard is deleted", (done) => {
            chai.request(backend_api)
            .get("/flashCard")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.flashcards).to.deep.not.include(["silla","chair"]);
                done();
            });
        });
    });

});