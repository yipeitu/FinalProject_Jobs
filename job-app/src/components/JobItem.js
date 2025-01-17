import React, { Component } from 'react';
import { Grid,Segment, Image, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types'


class JobItem extends Component {  
    
  static propTypes = {
    job: PropTypes.object.isRequired,
    jobPicUrl: PropTypes.string.isRequired,
    onRelatedSkill: PropTypes.func.isRequired,
    relatedSkills: PropTypes.object.isRequired, 
    onJobPic: PropTypes.func.isRequired
  }


  renderSkills = (index, skillName) => (
    <div key={index}>Skill{index}: {skillName.slice(0, 20)+(skillName.length > 20? "...":"")}</div>
  )

  render() {
    const {job, jobPicUrl, onRelatedSkill, relatedSkills, onJobPic} = this.props
    var jobName = "title" in job ? job.title:job.suggestion
    // console.log(job.uuid, job.uuid in relatedSkills)
    var indents = [];
    var img = (<Loader active inline='centered' />)
    if(jobPicUrl === ""){
      if(job !== undefined && onJobPic !== undefined) onJobPic(job.uuid, jobName)
    } else{
      img = (<Image className="JobPic" src={jobPicUrl}/>)      
    }
    if(job.uuid in relatedSkills){
      if(relatedSkills[job.uuid] === undefined || relatedSkills[job.uuid].length === 0){
        indents = "no skills to show"
      }
      else {
          for (var i = 0; i < 3; i++) {
          var skillName = relatedSkills[job.uuid][i].skill_name
          indents.push(this.renderSkills(i+1, skillName));
        }
      }
    } else {
      indents =  (<p className="loading">loading</p>)
      if(onRelatedSkill !== undefined) onRelatedSkill(job.uuid)
    }
    return (
      <div className="JobItem">
        <Segment textAlign='left' className='ItemSeg'>
            <Grid>
            <Grid.Row>
            <Grid.Column width={10}> 
                <h3>{jobName.slice(0, 20)+(jobName.length > 20? "...":"")}</h3>
                <div>{indents}</div>
            </Grid.Column>
            <Grid.Column width={6}>  
                {img}
            </Grid.Column>
            </Grid.Row>
            </Grid>
        </Segment>
        
      </div>
    );
  }
}

export default JobItem;