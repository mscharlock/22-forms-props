import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL =  `http://www.reddit.com/r/`;
//${searchFormBoard}.json?limit=${searchFormLimit}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      limit: 100,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
  }


  componentDidMount() {
    console.log('__FORM_PROPS__', this.props);
    console.log('__FORM_STATE__', this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.topicSelect(this.state.topic, this.state.limit);
  }

  handleTopicChange(e) {
    this.setState({topic: e.target.value});
  }

  handleLimitChange(e) {
    this.setState({limit: e.target.value});
  }

  render() {
    return (
      <form className="searchForm"
      onSubmit = {this.handleSubmit}>

      <input
        type="text"
        placeholder="Type in a topic"
        value = {this.state.topic}
        onChange = {this.handleTopicChange}
        />

      <input
        type="number"
        min = "0"
        max = "100"
        placeholder = "100"
        value = {this.handleLimitChange}
        />

        <button type="submit">Click to search</button>
        </form>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <section className="results list">
      //if there are results, then show them but if not give an err//

      {this.props.results ?
        <ul>
          {this.props.results.map((item, i) => {
            return(
              <li key={i}>
                <a 
            )
          })}
        :
      }
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicLookup: [], //this will be search results list?
      topicSelected: {}, //we pick one in there to show & that's the one that we put into text input in Search Form
      topicError: null,
    };
    this.topicStateShow = this.topicStateShow.bind(this);
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

//Thank you to Said and Kyle
  redditTopicFetch(searchFormBoard, searchFormLimit) {
    superagent.get(`${API_URL}/${searchFormBoard}.json?limit=${searchFormLimit}`)
    .then(res => {
      console.log('request success', res.body.data.children.data.url); //that's where our stuff lives
      this.setState({
        results: res.body.data.children, //maybe think about what is being returned here, we have to get the children so we can access the stuff on them
        searchErrorMessage: null,
      });
    })
  .catch(err => {
    console.error(err);
    this.setState({
      results: null,
      searchErrorMessage:'NOPE',
    });
  });
  }

  render(){
    return(
      <section className="application">
        <h1>Helloooooo</h1>
        <SearchForm
        topicSelect = {this.topicStateShow} />

        { this.state.results.length ?
          <h2>Selected: {this.state.results.length}</h2>
          : <div>
          <p>Make a request</p>
          </div>
        }
        </section>
    );
  }
}
