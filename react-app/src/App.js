import './App.css';
import {useState} from 'react';
import styled from "styled-components";

const Outer = styled.div`
  padding: 100px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 20px;
`;

function App() {
    const [keywords, setKeywords] = useState([]);
    const [elasticKeywords, setElasticKeywords] = useState([]);
    const [trieKeywords, setTrieKeywords] = useState([]);
    const [trieSuffixKeywords, setTrieSuffixKeywords] = useState([]);
    const [elasticKeywords2, setElasticKeywords2] = useState([]);
    const [elasticKeywords2Nori, setEleasticKeywords2Nori] = useState([]);
    const [elasticKeywords2NoriDiscard, setElasticKeywords2NoriDiscard] = useState([]);

    function onKeywordChangeHandler(event) {
        const keyword = event.target.value;
        const url = `http://172.30.1.26:8000/search/${keyword}`;
        fetch(url)
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(result => {
                if (result) {
                    setKeywords(result.data);
                }
            })
    }

    function onTrieKeywordChangeHandler(event) {
        const keyword = event.target.value;
        const url = `http://172.30.1.26:8000/search_trie/${keyword}`;
        fetch(url)
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(result => {
                if (result) {
                    setTrieKeywords(result.data);
                }
            })
    }

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
        const url = `http://172.30.1.26:9200/autocomplete_test_2/_search`
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

    return (
        <Outer>
            <div>
                <div class={'input-group mb-3'}>
                    <span className={'input-group-text'}>SQL LIKE 검색</span>
                    <input
                        className={'form-control'}
                        type='text'
                        onChange={onKeywordChangeHandler}></input>
                </div>
                <ul className={'list-group'}>
                    {keywords.map((keyword, index) => {
                        return (
                            <li className='list-group-item list-group-item-action'>{keyword}</li>
                        )
                    })}
                </ul>
            </div>
            <div>
                <div>
                    <div className={'mb-3'}>
                        <div className={'input-group mb-3'}>
                            <span className={'input-group-text'}>Elasticsearch</span>
                            <input type='text' className={'form-control'} onChange={onElasticKeywor2Changehandler}></input>
                        </div>
                        <ul className='list-group'>
                            {elasticKeywords2.map((keyword, index) => {
                                return (
                                    <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>
                                )
                            })}
                        </ul>
                    </div>
                    <div>
                        <div className={'input-group mb-3'}>
                            <span className={'input-group-text'}>Elasticsearch-nori</span>
                            <input className={'form-control'} type='text' onChange={onElasticKeyword2NoriChangeHandler}></input>
                        </div>
                        <ul className={'list-group mb-3'}>
                        {elasticKeywords2Nori.map((keyword, index) => {
                            return (
                                <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>
                            )
                        })}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <div>
                        <div className={'input-group mb-3'}>
                            <span className={'input-group-text'}>Elasticsearch-nori(discard)</span>
                            <input className={'form-control'} type='text' onChange={onElasticKeyword2NoriDiscardChangeHandler}></input>
                        </div>
                        <ul className={'list-group'}>
                        {elasticKeywords2NoriDiscard.map((keyword, index) => {
                            return (
                                <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>
                            )
                        })}
                        </ul>
                    </div>
            </div>
            <div>
                <div className={'input-group mb-3'}>
                    <span className={'input-group-text'}>Trie prefix</span>
                    <input className={'form-control'} type='text' onChange={onTrieKeywordChangeHandler}></input>
                </div>
                <ul className={'list-group mb-3'}>
                    {trieKeywords.map((keyword, index) => {
                        return (
                            <li className={'list-group-item list-group-item-action'}>{keyword.name}</li>
                        )
                    })}
                </ul>
                <div className={'input-group mb-3'}>
                    <span className={'input-group-text'}>Trie prefix + suffix</span>
                    <input className={'form-control'} type='text' onChange={onTrieSuffixKeywordChangeHandler}></input>
                </div>
                <ul className={'list-group'}>
                    {trieSuffixKeywords.map((keyword, index) => {
                        return (
                            <li className={'list-group-item list-group-item-action'}>{keyword}</li>
                        )
                    })}

                </ul>
            </div>
        </Outer>
    );
}


export default App;
