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
        const url = `http://localhost:9200/autocomplete_test_1/_search`
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


    return (
        <Outer>
            <div>
                <div>SQL WHERE LIKE 검색</div>
                <input type='text' onChange={onKeywordChangeHandler}></input>
                <ul>
                    {keywords.map((keyword, index) => {
                        return (
                            <li>{keyword}</li>
                        )
                    })}
                </ul>
            </div>
            <div>
                <div>
                    <div>Elasticsearch API 검색(기본)</div>
                    <input type='text' onChange={onElasticKeywor2Changehandler}></input>
                    <ul>
                        {elasticKeywords2.map((keyword, index) => {
                            return (
                                <li>{keyword.name}</li>
                            )
                        })}

                    </ul>
                    <div>Elasticsearch API 검색(nori plugin 적용)</div>
                    <input type='text' onChange={onElasticKeyword2NoriChangeHandler}></input>
                    <ul>
                        {elasticKeywords2Nori.map((keyword, index) => {
                            return (
                                <li>{keyword.name}</li>
                            )
                        })}

                    </ul>
                </div>

            </div>
            <div>
                <div>Trie prefix search(python fast api)</div>
                <input type='text' onChange={onTrieKeywordChangeHandler}></input>
                <ul>
                    {trieKeywords.map((keyword, index) => {
                        return (
                            <li>{keyword.name}</li>
                        )
                    })}

                </ul>
            </div>
            <div>
                <div>Trie prefix + suffix search(python fast api)</div>
                <input type='text' onChange={onTrieSuffixKeywordChangeHandler}></input>
                <ul>
                    {trieSuffixKeywords.map((keyword, index) => {
                        return (
                            <li>{keyword}</li>
                        )
                    })}

                </ul>
            </div>
        </Outer>
    );
}


export default App;
