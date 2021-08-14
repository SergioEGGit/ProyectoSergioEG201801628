import React, {Component} from 'react';
import './mensajesca.css';
import axios from 'axios';
import Logo from '../Assets/login.jpg';
import {Table} from "react-bootstrap";
const $ = require("jquery");

class mensajesca extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: "",
            usuario_remitente: "",
            usuario_destinatario: "",
            asunto: "",
            cuerpo: "",
            variables: [],
            usuarios: [],
            mensajes: [],
            asignacioncurso: []
        };
        this.clearData = this.clearData.bind(this);
        this.tablaclick = this.tablaclick.bind(this);
        this.tablaclick2 = this.tablaclick2.bind(this);
    }
    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    submitHandler = e => {
        e.preventDefault();
        console.log(this.state);
        const variables = this.state.variables;
        axios.post('http://localhost:4000/api/mensajes', {
            usuario_remitente: variables.nombre_miembro,
            usuario_destinatario: this.state.usuario_destinatario,
            asunto: this.state.asunto,
            cuerpo: this.state.cuerpo
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error.response)
            });
        this.clearData();
    };

    componentDidMount() {
        axios.get('http://localhost:4000/api/variables/1')
            .then(response => {
                this.setState({variables: response.data});
                let user = response.data.nombre_miembro;
                const {variables} = this.state;
                axios.get('http://localhost:4000/api/mensajes')
                    .then(response => {
                        console.log(response);
                        const arreglo = response.data.filter(d => d.usuario_destinatario === user);
                        console.log(arreglo);
                        this.setState({mensajes: arreglo})
                    })
                    .catch(error => {
                        console.log(error)
                    });
                axios.get('http://localhost:4000/api/asignacioncurso')
                    .then(response => {
                        console.log(response);
                        const arreglo = response.data.filter(d => d.titular === variables.nombre_miembro);
                        console.log(arreglo);
                        this.setState({asignacioncurso: arreglo})
                    })
                    .catch(error => {
                        console.log(error)
                    });
            })
            .catch(error => {
                console.log(error)
            });
        axios.get('http://localhost:4000/api/usuarios')
            .then(response => {
                const arreglo = response.data.filter(d => d.tipo === "Administrador" || d.tipo === "Colaborador");
                console.log(arreglo);
                this.setState({usuarios: arreglo})
            })
            .catch(error => {
                console.log(error)
            });
    }


    tablaclick(event){
        let _this = this;
        $('table tr').on('click',function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            var dato = $(this).find('td:eq( 1 )').html();
            console.log(dato);
            _this.setState(
                {
                    usuario_destinatario: dato
                }
            );
        });
        event.preventDefault();
    }

    tablaclick2(event){
        let _this = this;
        let {variables} = this.state;
        $('table tr').on('click',function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            var dato = $(this).find('td:eq( 0 )').html();
            console.log(dato);

            if(window.confirm("Seguro Que Desea Eliminar El Mensaje?")){
                axios.delete(`http://localhost:4000/api/mensajes/${dato}`)
                    .then(response => {
                        console.log(response);
                        alert("Mensaje Eliminado Con Exito");
                        axios.get('http://localhost:4000/api/mensajes')
                            .then(response => {
                                console.log(response);
                                const arreglo = response.data.filter(d => d.usuario_destinatario === variables.nombre_miembro);
                                console.log(arreglo);
                                _this.setState({mensajes: arreglo})
                            })
                            .catch(error => {
                                console.log(error)
                            });
                    })
                    .catch(error => {
                        console.log(error.response)
                    });
            }

        });
        event.preventDefault();
    }

    clearData(){
        this.setState(
            {
                id: "",
                usuario_remitente: "",
                usuario_destinatario: "",
                asunto: "",
                cuerpo: ""
            }
        );
    }

    render() {
        const {usuario_remitente, usuario_destinatario, asunto, cuerpo, usuarios, mensajes, asignacioncurso} = this.state;
        return (

            <div className="cont">
                <img src={Logo} width="96" height="100" alt="" id="nlogo1"/>
                <label id="lnt1" name="labeli">Mensajes</label>

                <label id="lnti1" name="labelu">Asunto:</label>
                <label id="lndes1" name="labelu">Destinatario:</label>
                <input name="asunto" type="text" required="required" id="int1" value={asunto} onChange={this.changeHandler} placeholder="Asunto"/>
                <input name="usuario_destinatario" type="text" required="required" id="indes1" disabled={true} value={usuario_destinatario} onChange={this.changeHandler} placeholder="Usuario"/>
                <label id="lnd1" name="labelp">Cuerpo:</label>
                <textarea name="cuerpo" type="text" required="required" id="ind1" value={cuerpo} onChange={this.changeHandler} placeholder="Cuerpo"/>



                <input name="buttoni" type="button" id="bbr1" onClick={this.submitHandler} value="Enviar"/>



                <label id="usuarios" name="labeli">Usuarios</label>
                <label id="buzon" name="labeli">Buzón De Entrada</label>
                <div id="tablep">
                    <Table id="table" striped bordered hover size="sm" variant="dark">
                        <thead>
                        <tr>
                            <th width="60">Id</th>
                            <th width="60">Usuario</th>
                            <th width="60">Tipo</th>
                            <th width="60">Curso</th>
                            <th width="60">Seccion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            usuarios.length ?
                                usuarios.map(
                                    usuario =>
                                        <tr key={usuario.id} onClick={this.tablaclick}>
                                            <td>{usuario.id}</td>
                                            <td>{usuario.us}</td>
                                            <td>{usuario.tipo}</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                ) :
                                null
                        }
                        {
                            asignacioncurso.length ?
                                asignacioncurso.map(
                                    asignacion =>
                                        <tr key={asignacion.id} onClick={this.tablaclick}>
                                            <td>{asignacion.id}</td>
                                            <td>{asignacion.estudiante}</td>
                                            <td>Estudiante</td>
                                            <td>{asignacion.curso}</td>
                                            <td>{asignacion.secciona}</td>
                                        </tr>
                                ) :
                                null
                        }
                        </tbody>
                    </Table>
                </div>




                <div id="tablep2">
                    <Table id="table2" striped bordered hover size="sm" variant="dark">
                        <thead>
                        <tr>
                            <th width="60">Id</th>
                            <th width="30">Remitente</th>
                            <th width="60">Asunto</th>
                            <th width="60">Cuerpo</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            mensajes.length ?
                                mensajes.map(
                                    mensaje =>
                                        <tr key={mensaje.id} onClick={this.tablaclick2}>
                                            <td>{mensaje.id}</td>
                                            <td>{mensaje.usuario_remitente}</td>
                                            <td>{mensaje.asunto}</td>
                                            <td>{mensaje.cuerpo}</td>
                                        </tr>
                                ) :
                                null
                        }
                        </tbody>
                    </Table>
                </div>



            </div>
        );
    }
}


export default  mensajesca;


