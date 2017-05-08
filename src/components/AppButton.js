/**
 * Created by lx on 2017/5/3.
 */

import React, {Component} from 'react'
import request from 'utils/request'
import PubSub from 'pubsub-js'

import {Button} from 'antd'

export class AppButton extends Component {


  constructor(props) {
    super();

    let behavior = props.metadata.behavior;
    if (behavior && behavior.type == "openModal") {
      this.handleClick = () => {
        PubSub.publish(`${props.metadata.behavior.pageId}.openModal`, {
          dataContext: props.dataContext,
          behavior: props.metadata.behavior
        });
        // props.setState({[props.metadata.behavior.pageId]: true});
        props.onClick(props.metadata)
      }
    } else if (behavior && behavior.type == "closeModal") {
      this.handleClick = () => {
        PubSub.publish(`${props.metadata.behavior.pageId}.closeModal`, "");

        props.onClick(props.metadata)
      }
    }
    else if (behavior && behavior.type == "save") {
      this.handleClick = () => {
        PubSub.publish(`${props.metadata.behavior.pageId}.save`, behavior);

        props.onClick(props.metadata)
      }
    }


    console.log(props)
  }

  componentDidMount() {
  }


  // handleClick() {
  //
  // }

  render() {
    const {viewStyle, title, show} = this.props.metadata;


    //todo: mongodb like query paser
    if (show) {
      for (let x in show) {
        if (this.props.dataContext[x] != show[x]) {
          return <element></element>
        }
      }
    }

    return (
      <Button style={{margin: 5}} onClick={() =>

      this.handleClick && this.handleClick()
      } type={viewStyle}>
        {title}
      </Button>
    )
  }
}

AppButton.propTypes = {}

export default AppButton
