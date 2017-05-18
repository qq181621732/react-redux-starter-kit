/**
 * Created by lx on 2017/5/3.
 */

import React, {Component} from 'react'
import request from 'utils/request'
import PubSub from 'pubsub-js'

import {Button} from 'antd'
import sift from 'sift'
export class AppButton extends Component {


  constructor(props) {
    super();


    this.state = {
      disabled: props.current.disabled,
      dataContext: props.dataContext
    }

    PubSub.subscribe(`${props.id}.disabled`, (msg, data) => {
      this.setState({
        disabled: data.disabled
      })
    })

    PubSub.subscribe(`${props.id}.dataContext`, (msg, data) => {
      this.setState({
        dataContext: Object.assign({}, this.state.dataContext, data)
      })
    })

    if (props.current.subscribes != undefined) {

      props.current.subscribes.forEach(s => {
        PubSub.subscribe(s.event, (msg, data) => {
          if (s.pubs) {
            s.pubs.forEach(p => {
              if (p.payloadMapping) {
                let temp = {};


                //todo: merge dataContext
                p.payloadMapping.forEach(m => temp[m.key] = data[m.value])
                PubSub.publish(p.event,
                  Object.assign({}, this.state.dataContext, temp)
                )
              }
              else
                PubSub.publish(p.event,
                  Object.assign({}, this.state.dataContext, p.payload)
                )
            })

          }
        })
      })
    }

    if (props.current.behavior && props.current.behavior['forEach']) {
      props.current.behavior.forEach(behavior => {
        if (behavior.type == "fetch") {
          this.handleClick = () => {


            let currentDataSource = props.metadata.dataSource.find(d => d.key == behavior.dataSource);

            if (currentDataSource && currentDataSource.type == "api") {

              let body = {};
              if (this.state.dataContext && currentDataSource.params)
                currentDataSource.params.forEach(p => {
                  body[p.key] = this.state.dataContext[p.value]
                })
              request("http://localhost:3005" + currentDataSource.url,
                {
                  method: currentDataSource.method,
                  body: JSON.stringify(body)
                }
                , (d) => {
                  if (d.success && behavior.callbackPubs) {
                    behavior.callbackPubs.forEach(c => {
                      PubSub.publish(c.event, "")
                    })
                  }
                  // PubSub.publish(`${behavior.target}.reload`, "")

                })
            }
          }
        }
        else if (behavior.type == "event") {
          this.handleClick = () => {

            let payload = {};
            if (behavior.payloadMapping) {
              behavior.payloadMapping.forEach(m => {
                payload[m.key] = this.state.dataContext[m.value]
              })
              PubSub.publish(behavior.event, Object.assign({}, payload, behavior.payload))
            }
            else {
              PubSub.publish(behavior.event, Object.assign({}, this.state.dataContext, behavior.payload))
            }


          }
        }

      })
    }


    // let behavior = props.current.behavior;
    // if (behavior && behavior.type == "openModal") {
    //   this.handleClick = () => {
    //     PubSub.publish(`${props.current.behavior.pageId}.openModal`, {
    //       dataContext: this.state.dataContext || props.dataContext,
    //       behavior: props.current.behavior
    //     });
    //     // props.setState({[props.metadata.behavior.pageId]: true});
    //     props.onClick(props.current)
    //   }
    // } else if (behavior && behavior.type == "closeModal") {
    //   this.handleClick = () => {
    //     PubSub.publish(`${props.current.behavior.pageId}.closeModal`, "");
    //
    //     props.onClick(props.current)
    //   }
    // }
    // else if (behavior && behavior.type == "save") {
    //   this.handleClick = () => {
    //     PubSub.publish(`${props.pageId}.save`, behavior);
    //
    //     props.onClick(props.current)
    //   }
    // }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`${this.props.id}.disabled`);
    PubSub.unsubscribe(`${this.props.id}.dataContext`);
    if (this.props.current.subscribes != undefined) {
      this.props.current.subscribes.forEach(s => {
        PubSub.unsubscribe(s.event);
      })
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.disabled == nextState.disabled;
  }

  // handleClick() {
  //
  // }

  render() {
    const {viewStyle, title, show} = this.props.current;
    if (show) {
      var r = sift.keyOf(show, this.props);
      if (!r)
        return <element></element>
    }
    return (
      <Button disabled={this.state.disabled} style={{marginLeft: 3,}} onClick={() =>

      this.handleClick && this.handleClick()
      } type={viewStyle}>
        {title}
      </Button>
    )
  }
}

AppButton.propTypes = {}

export default AppButton