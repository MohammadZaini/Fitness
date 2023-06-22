import axios from "axios";

export default axios.create({

    baseURL: 'https://musclewiki.p.rapidapi.com/exercises',
    headers: {
        'X-RapidAPI-Key': '40f0a4af0cmshb8e7dd0f0f14585p172ed7jsn0395b653ef15',
        'X-RapidAPI-Host': 'musclewiki.p.rapidapi.com'
    }
});
