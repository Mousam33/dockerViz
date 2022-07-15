import { useState } from 'react';
import axios from 'axios';
import "./styles.css";

export const FileUploader = ({}) => {
    document.title = "DockerViz GUI";

    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [noVolumes, setNoVolumes] = useState(false);

    const onInputChange = (e) => {
        setFile(e.target.files[0])
        document.getElementById('error').setAttribute("hidden", "hidden")
        document.getElementById('response').setAttribute("hidden", "hidden")
        document.getElementById('fileName').innerHTML = e.target.files[0].name
    };

    const onChecked = () => {
        setNoVolumes(!noVolumes)
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('file', file);
        if (noVolumes){
            data.append('noVolumes', "Yes")
        } else {
            data.append('noVolumes', "No")
        }
        axios.post('https://dockercheese.mousam.dev/upload', data, {
            responseType: "arraybuffer"
          })
        .then((res) => {
            const base64 = btoa(
                new Uint8Array(res.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              )
            setImage(base64)
            document.getElementById('response').removeAttribute("hidden")
        })
        .catch((err) => {
            document.getElementById('response').setAttribute("hidden", "hidden")
            document.getElementById('error').removeAttribute("hidden")
            document.getElementById('error').innerHTML = err
        })
    };

    return (
    <center>
    <div class = "custom-form">
     <form method="post" onSubmit={onSubmit}>
        <table>
        <th><label class="custom-volume-label">
            DockerViz<br></br>Upload your docker-compose file for graph</label></th>
        <tr><div id = 'fileName' align = "center" class = "filename"></div></tr>
        </table>
        <tr><td>
        <label class="custom-volume-label">No Volumes</label>&nbsp;
        <input type="checkbox" onChange={onChecked}/>&nbsp;&nbsp;&nbsp;&nbsp;
        <label class="custom-file-upload">
        <input type="file" onChange={onInputChange}/>
        Choose File
        </label>&nbsp;&nbsp;&nbsp;&nbsp;
        <label class="custom-file-upload">
            <input type= "submit"/>Upload
        </label></td></tr>
     </form>
     <tr><td><label class="custom-volume-label">
     <a href = "https://github.com/pmsipilot/docker-compose-viz#how-to-read-the-graph">
         How to read the graph
     </a></label></td></tr><br></br>
     <div class="error" id = 'error' hidden></div>
     <img src={`data:;base64,${image}`} id = 'response' hidden/>
     </div>
    
    </center>)
};