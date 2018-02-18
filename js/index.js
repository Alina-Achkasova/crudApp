var Panel = ReactBootstrap.Panel,
    Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button,
    Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem;
var FormGroup = ReactBootstrap.FornGroup;

// Load Recipe Items or set default Bulletin Items
var bulletins = typeof localStorage["bulletinBoard"] != "undefined" ? JSON.parse(localStorage["bulletinBoard"]) : [{ title: "Dog", description: "Smart and kind", phone: "9036524564", city: "Moscow" }, { title: "Cat", description: "Fluffy and cute", phone: "9629753708", city: "Kazan" }, { title: "Coach", description: "Comfortable", phone: "9261536856", city: "Korolyov" }],
    globalTitle = "",
    globalDescription,
    globalPhone,
    globalCity; // Define global title, description, phone and city.

// BulletinBoard class. This holds all bulletins.
var BulletinBoard = React.createClass({
  displayName: "BulletinBoard",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Accordion,
        null,
        this.props.data
      )
    );
  }
});

// Bulletin class. This is the display for a recipe in BulletinBoard
var Bulletin = React.createClass({
  displayName: "Bulletin",

  remove: function remove() {
    bulletins.splice(this.props.index, 1);
    update();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h4",
        { className: "text-center" },
        this.props.title
      ),
      React.createElement("hr", null),
      React.createElement(Input, { type: "textarea", label: "Description", value: this.props.description }),
      React.createElement(Input, { type: "tel", label: "Phone", value: this.props.phone, pattern: $("#phone").mask("(999) 999-9999") }),
      React.createElement(Input, { type: "text", label: "City", value: this.props.city }),
      React.createElement(
        ButtonToolbar,
        null,
        React.createElement(
          Button,
          { "class": "delete", bsStyle: "danger", id: "btn-del" + this.props.index, onClick: this.remove },
          "Delete"
        )
      )
    );
  }
});

// BulletinAdd class. This contains the Modal and Add Bulletin button
var BulletinAdd = React.createClass({
  displayName: "BulletinAdd",

  getInitialState: function getInitialState() {
    return { showModal: false };
  },
  close: function close() {
    globalTitle = "";
    globalDescription = "";
    globalPhone = "";
    globalCity = "";
    this.setState({ showModal: false });
  },
  open: function open() {
    this.setState({ showModal: true });
    if (document.getElementById("title") && document.getElementById("description") && document.getElementById("phone")) {
      $("#title").val(globalTitle);
      $("#description").val(globalDescription);
      $("#phone").val(globalPhone);
      $("#city").val(globalCity);
    } else requestAnimationFrame(this.open);
  },
  add: function add() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var phone = document.getElementById("phone").value;
    var city = document.getElementById("city").value;

    if (title.length < 1 || title.length > 100) {
      title.length < 1 ? alert("Please add a title") : alert("Max length of title is 100 charaters");
    } else if (description.length > 300) {
      alert("Max length of description is 300 charaters");
    } else if (phone.length < 1) {
      alert("Please add a phone number");
    } else {
      bulletins.push({ title: title, description: description, phone: phone, city: city });
      update();
      this.close();
    }
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        {
          bsStyle: "primary",
          bsSize: "large",
          onClick: this.open,
          id: "show"
        },
        "New"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            { id: "modalTitle" },
            "New"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "form",
            null,
            React.createElement(Input, { type: "text", label: "Title", placeholder: "Title", id: "title" }),
            React.createElement(Input, { type: "text", label: "Description", placeholder: "Description", id: "description" }),
            React.createElement(Input, { type: "text", label: "Phone", placeholder: "Phone", id: "phone", pattern: $("#phone").mask("(999) 999-9999") }),
            React.createElement(
              "label",
              { "for": "city" },
              "City"
            ),
            React.createElement(
              "select",
              { placeholder: "select", id: "city", name: "city" },
              React.createElement(
                "option",
                { value: "Moscow" },
                "Moscow"
              ),
              React.createElement(
                "option",
                { value: "Saint Petersburg" },
                "Saint Petersburg"
              ),
              React.createElement(
                "option",
                { value: "Kazan" },
                "Kazan"
              ),
              React.createElement(
                "option",
                { value: "Korolyev" },
                "Korolyev"
              )
            )
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.add, bsStyle: "primary", id: "addButton" },
            "Add"
          ),
          React.createElement(
            Button,
            { onClick: this.close },
            "Close"
          )
        )
      )
    );
  }
});

// Update function to display all the bulletins
function update() {
  localStorage.setItem("bulletinBoard", JSON.stringify(bulletins));
  var rows = [];
  for (var i = 0; i < bulletins.length; i++) {
    rows.push(React.createElement(
      Panel,
      { header: bulletins[i].title, eventKey: i, bsStyle: "success" },
      React.createElement(Bulletin, { title: bulletins[i].title, description: bulletins[i].description, phone: bulletins[i].phone, city: bulletins[i].city, index: i })
    ));
  }
  ReactDOM.render(React.createElement(BulletinBoard, { data: rows }), document.getElementById("container"));
}

// Render the add button (and modal)
ReactDOM.render(React.createElement(BulletinAdd, null), document.getElementById("button"));
update(); // Initially render the bulletin board