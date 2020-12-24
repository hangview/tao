import React from 'react';
import './App.css';
import { Button, Input, Row, Col } from 'antd';
import { getUrl } from './service';
const { TextArea } = Input;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        const { url } = this.state;
        console.log(url);
        getUrl(url).then((res) => {
            console.log(11111, res);
        })
    }

    render() {
        return (
            <div className="App">
                <Row>
                    <Col span={12}>
                        <TextArea
                            onChange={e => this.setState({url : e.target.value})}
                            placeholder="输入地址"
                            autoSize={{minRows: 5}}
                        />
                    </Col>
                </Row>
                <Row justify='start'>
                    <Col flex={0}>
                        <Button onClick={() => this.submit()} type="primary" >解析</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default App;
