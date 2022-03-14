import { isVisible } from '@testing-library/user-event/dist/utils';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Main({}) {
    const [inputTitle, setInputTitle] = useState("");
    const [inputYear, setInputYear] = useState("");
    const [inputType, setInputType] = useState([]);
    const [data, fetchData] = useState([]);
    const [text, fetchText] = useState([]);
    const [innerText, setInnerText] = useState([]);

    const changeInputTitle = (event) => {
        event.preventDefault();
        const title = event.currentTarget.value;
        setInputTitle(title);
    }

    const changeInputYear = (event) => {
        event.preventDefault();
        const year = event.currentTarget.value;
        setInputYear(year);
    } 

    const changeInputType = (event) => {
        const checked = event.target.checked;
        if (checked) {
            setInputType(inputType.concat(event.target.value));
        } else {
            setInputType(inputType.filter((item) => item != event.target.value));
        }
        console.log(checked);
        console.log(event.target.value);
        console.log(inputType);
    }

    const search = (event) => {
        event.preventDefault();
        console.log(inputTitle);
        getData();
    }

    const getData = () => {
        if (inputType.length <= 1) {
            fetch('http://www.omdbapi.com/?apikey=6e42f517&s=' + inputTitle + '&y=' + inputYear + "&type=" + inputType)
                .then((res) => res.json())
                .then((res) => {
                console.log(res)
                if (res.Search == null) {
                    console.log("error");
                    fetchData([{"Title": "Invalid Result", "Year": "Undefined Time", "imdbID": "No IMBD ID"}]);
                } else {
                    fetchData(res.Search);
                    addInnerTextObj(res.Search);
                }
            })
        } else {
            console.log(inputType)
            for (let item of inputType) {
                fetch('http://www.omdbapi.com/?apikey=6e42f517&s=' + inputTitle + '&y=' + inputYear + "&type=" + item)
                    .then((res) => res.json())
                    .then((res) => {
                    console.log(res)
                    if (res.Search == null) {
                        console.log("error");
                        fetchData([{"Title": "Invalid Result", "Year": "Undefined Time", "imdbID": "No IMBD ID"}]);
                        return;
                    } else {
                        fetchData(data.concat(res.Search));
                        addInnerTextObj(res.Search);
                    }
                })
            }
        }
    }

    const addInnerTextObj = (obj) => {
        for (let item of obj) {
            const imdbID = item.imdbID;
            fetch('http://www.omdbapi.com/?apikey=6e42f517&i=' + imdbID)
                    .then((res) => res.json())
                    .then((res) => {
                    if (res.imdbID == null) {
                        console.log("invalid imdbID");
                        return;
                    } else  {
                        fetchText(text.concat(res));
                        const newList = innerText.concat({"imdbID": res.imdbID, "display": false});
                        setInnerText(newList);
                    }
            })
        }
        console.log("add imbd IDs to display");
    }

    const displayDetails = (event, item) => {
        event.preventDefault();
        const newList = innerText.map((i) => {
            if (i.imdbID == item.imdbID) {
              const updatedItem = {
                "imdbID": item.imdbID,
                "display": !i.display
              };
              return updatedItem;
            }
            return i;
        });
        setInnerText(innerText.filter((i) => i.imdbID != item.imdbID));
        setInnerText(innerText.concat(newList));
    }

    return (
        <div>
            <div class="container">
                <img src="http://wallpapercave.com/wp/wp1945909.jpg" />
                <h1>Welcome!</h1>
            </div>
            <h2><u>Directions:</u> This site allows you to search for information about any movie. Use the input box below to get started.</h2>
            <hr />
            <h2>Search Fields</h2>
            <i>Please leave a field blank if you do not want to input anything.</i>
            <div>Title: &nbsp;
                <input onChange={changeInputTitle} value={inputTitle} name="title"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {search(e);}
                }}/>
            </div>
            <div>Year: &nbsp;
                <input onChange={changeInputYear} value={inputYear} name="year"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {search(e);}
                }}/>
            </div>
            <div>Type:<br />
                <i>Check more than 1 box if needed.</i>
                <br />
                <input type="checkbox" value="movie" onClick={(e) => {changeInputType(e);}}/>
                <label for="checkbox">Movie</label><br />
                <input type="checkbox" value="series" onClick={(e) => {changeInputType(e);}}/>
                <label for="series">Series</label><br />
                <input type="checkbox" value="episode" onClick={(e) => {changeInputType(e);}}/>
                <label for="episode">Episode</label><br />
            </div>
            <button onClick={(e) => search(e)}>Search</button>
            <div style={data.length !== 0 ? {visibility: "visible"} : {visibility: "hidden"}}>
                Showing the first 10 results:
                <br />
                {/* <i>Click the IMBD ID # of a movie to view details.</i> */}
            </div>
            <ul>
                {data.map((item, i) => {
                    return (
                    <li key={i}>
                        {item.Title}({item.Year}), &nbsp;
                        IMBD ID #: <a 
                        // onClick={(e) => {
                        //     console.log(item);
                        //     displayDetails(e, item);
                        // }
                        ><u>{item.imdbID}</u></a> &nbsp; &nbsp;
                        <a href={item.Poster} target="_blank">{item.Poster !== "N/A" || "" ? "View Poster" : "No Poster Available"}</a>
                        {/* <div class="inn" id={item.imdbID}>
                            {text.map((txt) => {
                                return (
                                    <p>{txt.plot}</p>
                                )
                            })}
                        </div> */}
                    </li>
                    );
                })}
            </ul>
        </div>
    );
}

ReactDOM.render(<Main />, document.getElementById("root"));