import React from 'react';
import './App.css';
import {Button, Input, Row, Col, Card} from 'antd';
import {getUrl, getMediaUrl} from './service';
import ReactJson from 'react-json-view'
import {Player,ControlBar,} from 'video-react';

const {TextArea} = Input;

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            res: {},
            mediaUrl: '',
            mediaId: '',
            _status: {}
        };
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.load = this.load.bind(this);
        this.changeCurrentTime = this.changeCurrentTime.bind(this);
        this.seek = this.seek.bind(this);
        this.changePlaybackRateRate = this.changePlaybackRateRate.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.setMuted = this.setMuted.bind(this);
    }

    submit() {
        const {url} = this.state;
        console.log(url);
        getUrl(url).then((res) => {
            const liveUrl = res && res.data && res.data.url && decodeURIComponent(res.data.url);
            let _mediaUrl = '', _mediaId = '';
            if (liveUrl) {
                const { mediaUrl, mediaId } = getMediaUrl(liveUrl);
                _mediaUrl = mediaUrl;
                _mediaId = mediaId;
            }
            this.setState({
                res: res,
                mediaUrl: _mediaUrl,
                mediaId: _mediaId,
            });
        })
    }

    componentDidMount() {
        // subscribe state change
        // this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    }

    setMuted(muted) {
        return () => {
            this.player.muted = muted;
        };
    }

    handleStateChange(state) {
        // copy player state to this component's state
        this.setState({
            player: state
        });
    }

    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }

    load() {
        this.player.load();
    }

    changeCurrentTime(seconds) {
        return () => {
            const { player } = this.player.getState();
            this.player.seek(player.currentTime + seconds);
        };
    }

    seek(seconds) {
        return () => {
            this.player.seek(seconds);
        };
    }

    changePlaybackRateRate(steps) {
        return () => {
            const { player } = this.player.getState();
            console.log(player);
            this.player.playbackRate = player.playbackRate + steps;
        };
    }

    refreshPlaybackRateRate() {
        return () => {
            this.player.playbackRate = 1;
        };
    }

    changeVolume(steps) {
        return () => {
            const { player } = this.player.getState();
            this.player.volume = player.volume + steps;
        };
    }

    changeSource(name) {
        return () => {
            this.setState({
                // source: sources[name]
            });
            this.player.load();
        };
    }

    changeVideo() {
        const { newUrl } = this.state;
        this.setState({
            mediaUrl: newUrl
        })
        this.player.load();
    }

    getStatus() {
        if (!this.player) return;
        const { player } = this.player.getState();
        this.setState({_status: player})
    }

    render() {
        const {res, mediaUrl, mediaId, _status} = this.state;
        return (
            <div className="App">
                <Row>
                    <Col span={12}>
                        <Row>
                            <Col span={24}>
                                <TextArea
                                    onChange={e => this.setState({url: e.target.value})}
                                    placeholder="输入地址"
                                    autoSize={{minRows: 5}}
                                />
                            </Col>
                        </Row>
                        <Row justify='start'>
                            <Col flex={0}>
                                <Button onClick={() => this.submit()} type="primary">解析</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Card className='res' title="解析结果">
                                    <ReactJson src={res && res.data}/>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Card className='res' title="解析地址">
                                    {mediaUrl}
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Card className='res' title="视频ID">
                                    {mediaId}
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row justify='center'>
                            {
                                <Player
                                    ref={ player => this.player = player }
                                    fluid={false}
                                    width={500}
                                    height={600}
                                    muted={true}
                                    autoPlay={true}>
                                    { mediaUrl.includes('m3u8') && <source src={mediaUrl} type="application/x-mpegURL"/> }
                                    { !mediaUrl.includes('m3u8') && <source src={mediaUrl} /> }
                                    <ControlBar autoHide={false} />
                                </Player>
                            }
                        </Row>
                        <Row>
                            <Row className='res'>
                                <Button onClick={this.play} className="mr-3">
                                    播放
                                </Button>
                                <Button onClick={this.pause} className="mr-3">
                                    暂停
                                </Button>
                                <Button onClick={this.load} className="mr-3">
                                    重新加载
                                </Button>
                            </Row>
                            <Row className='res'>
                                <Button onClick={this.changeCurrentTime(15)} className="mr-3">
                                    快进15s
                                </Button>
                                <Button onClick={this.changeCurrentTime(-15)} className="mr-3">
                                    后退15s
                                </Button>
                                <Button onClick={this.seek(50)} className="mr-3">
                                    currentTime = 50
                                </Button>
                            </Row>
                            <Row className='res'>
                                <Button onClick={this.changePlaybackRateRate(0.1)} className="mr-3">
                                    快进+0.1
                                </Button>
                                <Button onClick={this.changePlaybackRateRate(1)} className="mr-3">
                                    快进+1
                                </Button>
                                <Button onClick={this.changePlaybackRateRate(-0.1)} className="mr-3">
                                    慢放-0.1
                                </Button>
                                <Button onClick={this.changePlaybackRateRate(-1)} className="mr-3">
                                    慢放-1
                                </Button>
                                <Button onClick={this.refreshPlaybackRateRate()} className="mr-3">
                                    重置速度
                                </Button>
                            </Row>
                            <Row className='res'>
                                <Button onClick={this.changeVolume(0.1)} className="mr-3">
                                    volume+=0.1
                                </Button>
                                <Button onClick={this.changeVolume(-0.1)} className="mr-3">
                                    volume-=0.1
                                </Button>
                                <Button onClick={this.setMuted(true)} className="mr-3">
                                    muted=true
                                </Button>
                                <Button onClick={this.setMuted(false)} className="mr-3">
                                    muted=false
                                </Button>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <Input style={{width: '500px'}} placeholder="视频地址" onChange={e => this.setState({newUrl: e.target.value})}/>
                                </Col>
                                <Col span={4}>
                                    <Button onClick={() => this.changeVideo()}>切换视频</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} style={{textAlign: 'left'}}>
                                    <Button onClick={() => this.getStatus()}>查看当前状态</Button>
                                </Col>
                                <Card>
                                    <ReactJson src={_status}/>
                                </Card>

                            </Row>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default App;
