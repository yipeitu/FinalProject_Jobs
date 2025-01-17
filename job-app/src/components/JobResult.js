import React, { Component } from 'react';
import { Grid, Label, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import JobItem from './JobItem';
import PropTypes from 'prop-types'
import {SEARCH_FAILURE} from '../data/DefinedData'

class JobResult extends Component {

  static propTypes = {
    jobs: PropTypes.array.isRequired,
    jobPics: PropTypes.object.isRequired,
    onRelatedSkill: PropTypes.func.isRequired,
    relatedSkills: PropTypes.object.isRequired,
    onJobPic: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (
      (windowBottom >= docHeight) && this.props.couldJobIndex && !this.state.loading
    ) {
      this.setState({
        loading: true
      })
      setTimeout(function() {
        this.props.onJobIndex()
        this.setState({
          loading: false
        })
      }.bind(this), 1000)
    }
  }

  renderJobs = (job, jobPicUrl, onRelatedSkill, relatedSkills, onJobPic) => (
    <Grid.Column key={job.uuid}>
      <Link to={"/job/"+job.uuid}>
        <JobItem job={job} jobPicUrl={jobPicUrl} onRelatedSkill={onRelatedSkill} relatedSkills={relatedSkills} onJobPic={onJobPic}/>
      </Link>
    </Grid.Column>
  )

  render() {
    const {jobs, jobPics, onRelatedSkill, relatedSkills, onJobPic, skillSelectName} = this.props
    var indents = (<Loader active inline='centered' />);
    if(jobs.length){
      indents = []
      for (var i = 0; i < jobs.length; i++) {
        if(jobs[i] === SEARCH_FAILURE) continue
        var jobPicUrl = jobs[i].uuid in jobPics? jobPics[jobs[i].uuid].small:""
        indents.push(this.renderJobs(jobs[i], jobPicUrl, onRelatedSkill, relatedSkills, onJobPic));
      }
    }
    var title = skillSelectName === ""?
    (<div className="SortSkillTitle"><p>2. We Recommand Jobs to you</p></div>):
    (<div className="SortSkillTitle">2. We Recommand Jobs to you based on the skill <Label className="SkillLabel" color='blue'>{skillSelectName}</Label> you chose</div>)

    return (
      <div className="JobResult" style={{padding: '3em 3em' }}>
        <div>{title}</div>
        <Grid container stackable doubling columns={3}>
          {indents}
        </Grid>
        {this.state.loading? (<p className="loading">loading</p>):""}
      </div>
    );
  }
}

export default JobResult;
