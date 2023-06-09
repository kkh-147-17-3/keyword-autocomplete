import './App.css';
import {useEffect, useState} from 'react';
import styled from "styled-components";
import throttle from 'lodash';
import _ from 'lodash';
import {useSearchParams} from "react-router-dom";

const Outer = styled.div`
  padding: 100px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 20px;
`;
function Test() {
    const [keywords, setKeywords] = useState([]);
    const [elasticKeywords, setElasticKeywords] = useState([]);
    const [trieKeywords, setTrieKeywords] = useState([]);
    const [trieSuffixKeywords, setTrieSuffixKeywords] = useState([]);
    const [elasticKeywords2, setElasticKeywords2] = useState([]);
    const [elasticKeywords2Nori, setEleasticKeywords2Nori] = useState([]);
    const [elasticKeywords2NoriDiscard, setElasticKeywords2NoriDiscard] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(()=>{
        if(!(searchParams.get('login') && searchParams.get('code'))) return

        const code = searchParams.get('code');

        const url = `localhost:8000/oauth?login=kakao&code=${code}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })


    }, [searchParams])


    const onKeywordChangeHandler = _.debounce((event) => {
        const keyword = event.target.value;
        if (keyword == "") return;
        const url = `/v2/dp-shop/product/search/auto-completed-elastic-keyword/${keyword}`;
        const options = {
            method: 'GET',
            headers: {
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX3R5cGUiOjAsInVpZHgiOiIyMjExIn0.a9zghI3zgOrp2Y1LsI2hQCTRbUGOkokJdkl_2VF6JQ2fKh23dlZ-ILcxYLJn-xzHP6bPsvHhX1SS5FUvrih7qw',
            }
        };
        fetch(url, options)
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(result => {
                if (result) {
                    setKeywords(result.data);
                }
            })
    }, 200);

    const onTrieKeywordChangeHandler = _.debounce((event) => {
        const keyword = event.target.value;
        if (keyword == "") return;
        const url = `/v2/dp-shop/product/search/auto-completed-keyword/${keyword}`;
        const options = {
            method: 'GET',
            headers: {
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX3R5cGUiOjAsInVpZHgiOiIyMjExIn0.a9zghI3zgOrp2Y1LsI2hQCTRbUGOkokJdkl_2VF6JQ2fKh23dlZ-ILcxYLJn-xzHP6bPsvHhX1SS5FUvrih7qw',
            }
        }
        fetch(url, options)
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(result => {
                if (result) {
                    result = (result['data']);
                    if (!result) {
                        result = [];
                    }
                    setTrieKeywords(result);
                }
            })
    }, 300);

    function onElasticKeywordChangeHandler(event) {
        const keyword = event.target.value;
        const url = `http://172.30.1.26:9200/autocomplete_test_1/_search`
        const option = {
            method: 'POST',
            body: JSON.stringify({
                "query": {
                    "match": {
                        "name": keyword
                    }
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(url, option)
            .then(res => res.json())
            .then(data => {
                const result = data.hits.hits;
                const keywords = result.map(element => {
                    return {
                        name: element._source.name
                    };
                });
                setElasticKeywords(keywords);
            })

    }
    function onTrieSuffixKeywordChangeHandler(event) {
            const keyword = event.target.value;
            const url = `http://172.30.1.26:8000/search_trie_jamo/${keyword}`;
            fetch(url)
                .then(res => {
                    if (res.ok) return res.json();
                })
                .then(result => {
                    if (result) {
                        setTrieSuffixKeywords(result.data);
                    }
                })
    }

    function onElasticKeywor2Changehandler(event){
        const keyword = event.target.value;
        const url = `http://172.30.1.26:9200/autocomplete_test_2/_search`
        const option = {
            method: 'POST',
            body: JSON.stringify({
                "query": {
                    "match": {
                        "name": keyword
                    }
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },

        }
        fetch(url, option)
            .then(res => res.json())
            .then(data => {
                const result = data.hits.hits;
                const keywords = result.map(element => {
                    return {
                        name: element._source.name
                    };
                });
                setElasticKeywords2(keywords);
            })

    }

    function onElasticKeyword2NoriChangeHandler(event){
        const keyword = event.target.value;
        const url = `http://172.30.1.26:9200/autocomplete_test_4/_search`
        const option = {
            method: 'POST',
            body: JSON.stringify({
                "query": {
                    "match": {
                        "name": keyword
                    }
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(url, option)
            .then(res => res.json())
            .then(data => {
                const result = data.hits.hits;
                const keywords = result.map(element => {
                    return {
                        name: element._source.name
                    };
                });
                setEleasticKeywords2Nori(keywords);
            })

    }

    function onElasticKeyword2NoriDiscardChangeHandler(event){
        const keyword = event.target.value;
        const url = `http://172.30.1.26:9200/autocomplete_test_3/_search`
        const option = {
            method: 'POST',
            body: JSON.stringify({
                "query": {
                    "match": {
                        "nori_name": keyword
                    }
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(url, option)
            .then(res => res.json())
            .then(data => {
                const result = data.hits.hits;
                const keywords = result.map(element => {
                    return {
                        name: element._source.name
                    };
                });
                setElasticKeywords2NoriDiscard(keywords);
            })
    }

    function redirectToKakaoLogin(){
        const clientId = '6caab81a61e4a30d34d021c1a41e8322';
        const redirectUrl = 'http://localhost:5173?login=kakao';
        const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;
        window.location.href = url;
    }

    return (
        <Outer>
            <div>
                <div class={'input-group mb-3'}>
                    <span className={'input-group-text'}>돌플숍 elasticsearch</span>
                    <input
                        className={'form-control'}
                        type='text'
                        onChange={onKeywordChangeHandler}></input>
                </div>
                <ul className={'list-group'}>
                    {keywords.map((keyword, index) => {
                        return (
                            <li className='list-group-item list-group-item-action'>{keyword.title}</li>
                        )
                    })}
                </ul>
            </div>
            {/*<div>*/}
            {/*    <div>*/}
            {/*        <div className={'mb-3'}>*/}
            {/*            <div className={'input-group mb-3'}>*/}
            {/*                <span className={'input-group-text'}>Elasticsearch</span>*/}
            {/*                <input type='text' className={'form-control'} onChange={onElasticKeywor2Changehandler}></input>*/}
            {/*            </div>*/}
            {/*            <ul className='list-group'>*/}
            {/*                {elasticKeywords2.map((keyword, index) => {*/}
            {/*                    return (*/}
            {/*                        <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <div className={'input-group mb-3'}>*/}
            {/*                <span className={'input-group-text'}>Elasticsearch-nori</span>*/}
            {/*                <input className={'form-control'} type='text' onChange={onElasticKeyword2NoriChangeHandler}></input>*/}
            {/*            </div>*/}
            {/*            <ul className={'list-group mb-3'}>*/}
            {/*            {elasticKeywords2Nori.map((keyword, index) => {*/}
            {/*                return (*/}
            {/*                    <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>*/}
            {/*                )*/}
            {/*            })}*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <div>*/}
            {/*            <div className={'input-group mb-3'}>*/}
            {/*                <span className={'input-group-text'}>Elasticsearch-nori(discard)</span>*/}
            {/*                <input className={'form-control'} type='text' onChange={onElasticKeyword2NoriDiscardChangeHandler}></input>*/}
            {/*            </div>*/}
            {/*            <ul className={'list-group'}>*/}
            {/*            {elasticKeywords2NoriDiscard.map((keyword, index) => {*/}
            {/*                return (*/}
            {/*                    <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>*/}
            {/*                )*/}
            {/*            })}*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*</div>*/}
            <div>
                <div className={'input-group mb-3'}>
                    <span className={'input-group-text'}>돌플숍 SQL</span>
                    <input className={'form-control'} type='text' onChange={onTrieKeywordChangeHandler}></input>
                </div>
                <ul className={'list-group mb-3'}>
                    {trieKeywords.map((keyword, index) => {
                        return (
                            <li className={'list-group-item list-group-item-action'}>{keyword.title}</li>
                        )
                    })}
                </ul>
                {/*<div className={'input-group mb-3'}>*/}
                {/*    <span className={'input-group-text'}>Trie prefix + suffix</span>*/}
                {/*    <input className={'form-control'} type='text' onChange={onTrieSuffixKeywordChangeHandler}></input>*/}
                {/*</div>*/}
                {/*<ul className={'list-group'}>*/}
                {/*    {trieSuffixKeywords.map((keyword, index) => {*/}
                {/*        return (*/}
                {/*            <li className={'list-group-item list-group-item-action'}>{keyword.}</li>*/}
                {/*        )*/}
                {/*    })}*/}

                {/*</ul>*/}
            </div>
            <div>
                <img src='/kakao_login_medium_narrow.png' onClick={redirectToKakaoLogin}></img>
            </div>
        </Outer>
    );
}


export default Test;
