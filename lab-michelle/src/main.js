import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL =  `http://www.reddit.com/r/`;

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


//We needed a SearchResultsList as a separate component that stored stuff instead of jamming it all inside of app.//
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
                <a href={item.data.url}>
                  <h2>{item.data.ttitle}</h2>
                </a>
                  <span>Upvoted: {item.data.ups}</span>
              </li>);
          })}
        </ul>
        : //OR//
        <h2>Sorry, no results to show</h2>
      }
      </section>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicLookup: [], //this will be search results list?
      topicError: null,
    };
    this.redditTopicFetch = this.redditTopicFetch.bind(this);
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

//Thank you to Said and Kyle
  redditTopicFetch(searchTopic, searchLimit) {
    superagent.get(`${API_URL}/${searchTopic}.json?limit=${searchLimit}`)
    .then(res => {
      console.log('request success');

      //Note that the data we are trying to get lives in res.body.data.children.data.url/etc//

      let sortedTopics = res.body.children.sort((a,b) => b.data.ups - a.data.ups);
      this.setState({
        topics: sortedTopics,
        searchErrorMessage: null,
      });
    })
  .catch(err => {
    console.error(err);
    this.setState({
      results: null,
      searchErrorMessage:'No Topics to Display',
    });
  });
  }

  render(){
    return(
      <section className="application">
        <h1>HUZZAH</h1>
        <SearchForm
        topicSelect = {this.redditTopicFetch} />
        <SearchResultsList results = {this.state.topicLookup}/>
      </section>
    );
  }
}

//DON'T FORGET TO RENDER//
ReactDom.render(<App />, document.getElementById('root'));
