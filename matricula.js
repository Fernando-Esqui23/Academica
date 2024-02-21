Vue.component('componente-matriculas', {
    data() {
        return {
            valor:'',
            matriculas:[],
            accion:'nuevo',
            matricula:{
                idMatricula: new Date().getTime(),
                codigo:'',
                nombre:'',
                carrera:'',
                monto:'',
                condicion:'',
                modalidad:'',
                foto:'',
            }
        }
    },
    methods:{
        buscarMatricula(e){
            this.listar();
        },
        eliminarMatricula(idMatricula){
            if( confirm(`Esta seguro de eliminar la matricula?`) ){
                let store = abrirStore('matriculas', 'readwrite'),
                query = store.delete(idMatricula);
            query.onsuccess = e=>{
                this.nuevoMatricula();
                this.listar();
            };
            }
        },
        modificarMatricula(matricula){
            this.accion = 'modificar';
            this.matricula = matricula;
        },
        guardarMatricula() {
            
            let codigoExistente = this.matriculas.some(mat => mat.codigo === this.matricula.codigo);

            if (codigoExistente) {
                
                alert('Error: El código de matrícula ya existe.');
                return;
            }

            
            let store = abrirStore('matriculas', 'readwrite'),
                query = store.put({ ...this.matricula });
            query.onsuccess = e => {
                this.nuevoMatricula();
                this.listar();
            };
            query.onerror = e => {
                console.error('Error al guardar en matriculas', e.message);
            };
        },
        nuevoMatricula(){
            this.accion = 'nuevo';
            this.matricula = {
                idMatricula: new Date().getTime(),
                codigo:'',
                nombre:'',
                carrera:'',
                monto: '',
                condicion:'',
                modalidad:''
            }
        },
        listar(){
            let store = abrirStore('matriculas', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.matriculas = data.result
                    .filter(matricula=>matricula.codigo.includes(this.valor) || 
                    matricula.nombre.toLowerCase().includes(this.valor.toLowerCase()) || 
                    matricula.carrera.toLowerCase().includes(this.valor.toLowerCase()) ||
                    matricula.condicion.toLowerCase().includes(this.valor.toLowerCase()) ||
                    matricula.modalidad.toLowerCase().includes(this.valor.toLowerCase()));
            };

        
        },

    },
    template: `
    <div class="my-4">
        <div class="row">
            <div class="col col-md-6">
                <div class="card text-bg">
                    <div class="card-header">REGISTRO DE MATRICULAS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo</div>
                            <div class="col col-md-3">
                                <input v-model="matricula.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre</div>
                            <div class="col col-md-5">
                                <input v-model="matricula.nombre" type="text" class="form-control">
                            </div>
                        </div>
                
                        <div class="row p-1">
                            <div class="col col-md-2">Carrera</div>
                            <div class="col col-md-3">
                                <input v-model="matricula.carrera" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Monto</div>
                            <div class="col col-md-3">
                                <input v-model="matricula.monto"  type="number" min="0" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Estado</div>
                            <div class="col col-md-3">
                            <select v-model="matricula.condicion" class="form-control">
                            <option value="BECA">Becario</option>
                            <option value="Media BECA">Medio Becario</option>
                            <option value="Pagante">Común</option>
                        </select>
                            </div>
                        </div>
                        
                        <div class="row p-1">
                            <div class="col col-md-2">Modalidad</div>
                            <div class="col col-md-3">
                            <select v-model="matricula.modalidad" class="form-control">
                            <option value="Presencial">Presencial</option>
                            <option value="Semi Presencial">Semi Presencial</option>
                            <option value="Virtual">Virtual</option>
                            </div>
                        </div>
                        
                        <div class="row p-1">
                            <div class="col col-md-2">
                                <img :src="matricula.foto" width="50"/>
                            </div>
                            
                        </div>

                        <div class="row p-1">
                        <div class="col text-center">
                            <div class="d-flex justify-content-center ">
                                <button @click.prevent.default="guardarMatricula" class="btn btn-primary ">GUARDAR</button>
                                <div style="margin-right: 20px;"></div>
                                <button @click.prevent.default="nuevoMatricula" class="btn btn-info">NUEVO</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-4">
            <div class="col col-md-8">
                <div class="card text-bg">
                    <div class="card-header">LISTADO DE MATRICULAS</div>
                    <div class="card-body">
                        <form id="frmMatricula">
                            <table class="table table table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="codigo, nombre, carrera" type="search" v-model="valor" @keyup="buscarMatricula" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>CARRERA</th>
                                        <th>MONTO</th>
                                        <th>ESTADO</th>
                                        <th>MODALIDAD</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarMatricula(matricula)" v-for="matricula in matriculas" :key="matricula.idMatricula">
                                        <td>{{matricula.codigo}}</td>
                                        <td>{{matricula.nombre}}</td>
                                        <td>{{matricula.carrera}}</td>
                                        <td>{{matricula.monto}}</td>
                                        <td>{{matricula.condicion}}</td>
                                        <td>{{matricula.modalidad}}</td>
                                        
                                        <td><button @click.prevent.default="eliminarMatricula(matricula.idMatricula)" class="btn btn-danger">eliminar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
});