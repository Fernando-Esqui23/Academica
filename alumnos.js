Vue.component('v-select-matricula', VueSelect.VueSelect);
Vue.component('componente-alumnos', {
    data() {
        return {
            valor:'',
            alumnos:[],
            accion:'nuevo',
            alumno:{
                matricula:{
                    id:'',
                    label:''
                },
                idAlumno: new Date().getTime(),
                codigo:'',
                nombre:'',
                responsable:'',
                fechanacimiento:'',
                departamento:'',
                municipio:'',
                direccion:'',
                sexo:'',
                telefono:'',
                carrera:'',
                correo:''
                
            }
        }
    },
    methods:{
        buscarAlumno(e){
            this.listar();
        },
        eliminarAlumno(idAlumno){
            if( confirm(`Esta seguro de eliminar el alumno?`) ){
                let store = abrirStore('alumnos', 'readwrite'),
                query = store.delete(idAlumno);
            query.onsuccess = e=>{
                this.nuevoAlumno();
                this.listar();
            };
            }
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.alumno = alumno;
        },
        guardarAlumno() {
            
            let codigoExistente = this.alumnos.some(al => al.codigo === this.alumno.matricula.label);

            if (codigoExistente) {
                
                alert('Error: El código de matrícula ya existe.');
                return;
            }

            if (this.alumno.matricula.id === '' || this.alumno.matricula.label === '') {
                console.error("Por favor seleccione una categoría");
                return;
            }
            this.alumno.codigo = this.alumno.matricula.label;
            let store = abrirStore('alumnos', 'readwrite'),
                query = store.put({ ...this.alumno });
            query.onsuccess = e => {
                this.nuevoAlumno();
                this.listar();
            };
            query.onerror = e => {
                console.error('Error al guardar en alumnos', e.message);
            };
        },
        nuevoAlumno(){
            this.accion = 'nuevo';
            this.alumno = {
                matricula:{
                    id:'',
                    label:''
                },
                idAlumno: new Date().getTime(),
                codigo:'',
                nombre:'',
                responsable:'',
                fechanacimiento:'',
                departamento:'',
                municipio:'',
                direccion:'',
                sexo:'',
                telefono:'',
                carrera:'',
                correo:''
                
            }
        },
        listar(){
            let storeCat = abrirStore('matriculas', 'readonly'),
                    dataCat = storeCat.getAll();
                dataCat.onsuccess = resp=>{
                    this.matricula = dataCat.result.map(matricula=>{
                        return {
                            id: matricula.idMatricula,
                            label:matricula.codigo
                        }
                    });
                };
            let store = abrirStore('alumnos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.alumnos = data.result
                    .filter(alumno=>alumno.codigo.includes(this.valor) || 
                    alumno.nombre.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.responsable.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.fechanacimiento.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.departamento.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.municipio.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.direccion.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.sexo.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.telefono.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.carrera.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.correo.toLowerCase().includes(this.valor.toLowerCase()));
            };
        }
    },
    template: `
    <div class="my-4">
        <div class="row">
            <div class="col col-md-6">
                <div class="card">
                    <div class="card-header text-bg">REGISTRO DE ALUMNOS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo</div>
                            <div class="col col-md-3">
                                <v-select-matricula required v-model="alumno.matricula" 
                                    :options="matricula">Por favor seleccione un codigo</v-select-matricula>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Responsable</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.responsable" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Fecha de nacimiento</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.fechanacimiento" type="date" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Departamento</div>
                            <div class="col col-md-5">
                                <select v-model="alumno.departamento" class="form-control">
                                <option value="">Seleccione un departamento</option>
                                <option value="Ahuachapán">Ahuachapán</option>
                                <option value="Cabañas">Cabañas</option>
                                <option value="Chalatenango">Chalatenango</option>
                                <option value="Cuscatlán">Cuscatlán</option>
                                <option value="La Libertad">La Libertad</option>
                                <option value="La Paz">La Paz</option>
                                <option value="La Unión">La Unión</option>
                                <option value="Morazán">Morazán</option>
                                <option value="San Miguel">San Miguel</option>
                                <option value="San Salvador">San Salvador</option>
                                <option value="San Vicente">San Vicente</option>
                                <option value="Santa Ana">Santa Ana</option>
                                <option value="Sonsonate">Sonsonate</option>
                                <option value="Usulután">Usulután</option>
                            </select>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Municipio</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.municipio" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Direccion</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.direccion" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Sexo</div>
                            <div class="col col-md-5">
                            <select v-model="alumno.sexo" class="form-control">
                            <option value="">Seleccione una opcion</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                        </select>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Telefono</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.telefono" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Carrera</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.carrera" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Correo</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.correo" type="email" class="form-control">
                            </div>
                        </div>
                        
                        <div class="row p-1">
                        <div class="col text-center">
                            <div class="d-flex justify-content-center ">
                                <button @click.prevent.default="guardarAlumno" class="btn btn-primary">GUARDAR</button>
                                <div style="margin-right: 20px;"></div>
                                <button @click.prevent.default="nuevoAlumno" class="btn btn-info">NUEVO</button>
                            </div>
                        </div>
                        </div>
                        
                
                    </div>
                    
                </div>
            </div>
            <div class="my-4">
            <div class="col col-col-md-15">
                <div class="card text-bg">
                    <div class="card-header">LISTADO DE ALUMNOS</div>
                    <div class="card-body">
                        <form id="frmAlumno">
                            <table class="table table table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="codigo, nombre" type="search" v-model="valor" @keyup="buscarAlumno" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>RESPONSABLE</th>
                                        <th>FECHA NACIMIENTO</th>
                                        <th>DEPARTAMENTO</th>
                                        <th>MUNICIPIO</th>
                                        <th>DIRECCION</th>
                                        <th>SEXO</th>
                                        <th>TELEFONO</th>
                                        <th>CARRERA</th>
                                        <th>CORREO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarAlumno(alumno)" v-for="alumno in alumnos" :key="alumno.idAlumno">
                                        <td>{{alumno.matricula.label}}</td>
                                        <td>{{alumno.nombre}}</td>
                                        <td>{{alumno.responsable}}</td>
                                        <td>{{alumno.fechanacimiento}}</td>
                                        <td>{{alumno.departamento}}</td>
                                        <td>{{alumno.municipio}}</td>
                                        <td>{{alumno.direccion}}</td>
                                        <td>{{alumno.sexo}}</td>
                                        <td>{{alumno.telefono}}</td>
                                        <td>{{alumno.carrera}}</td>
                                        <td>{{alumno.correo}}</td>
                                        <td><button @click.prevent.default="eliminarAlumno(alumno.idAlumno)" class="btn btn-danger">eliminar</button></td>
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