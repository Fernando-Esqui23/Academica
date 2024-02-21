Vue.component('v-select-matricula', VueSelect.VueSelect);
Vue.component('componente-inscripcions', {
    data() {
        return {
            valor:'',
            inscripcions:[],
            accion:'nuevo',
            inscripcion:{
                matricula:{
                    id:'',
                    label:''
                },
                idInscripcion: new Date().getTime(),
                codigo:'',
                nombre:'',
                carrera:'',
                cantidad_m:''
            }
        }
    },
    methods:{
        buscarInscripcion(e){
            this.listar();
        },
        eliminarInscripcion(idInscripcion){
            if( confirm(`Esta seguro de elimina el inscrito?`) ){
                let store = abrirStore('inscripcions', 'readwrite'),
                query = store.delete(idInscripcion);
            query.onsuccess = e=>{
                this.nuevoInscripcion();
                this.listar();
            };
            }
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        guardarInscripcion(){
            //almacenamiento del objeto inscripcions en indexedDB
            if( this.inscripcion.matricula.id=='' ||
                this.inscripcion.matricula.label=='' ){
                console.error("Por favor seleccione una categoria");
                return;
            }
            this.inscripcion.codigo = this.inscripcion.matricula.label;
            let store = abrirStore('inscripcions', 'readwrite'),
                query = store.put({...this.inscripcion});
            query.onsuccess = e=>{
                this.nuevoInscripcion();
                this.listar();
            };
            query.onerror = e=>{
                console.error('Error al guardar en inscripcions', e.message());
            };
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion = {
                matricula:{
                    id:'',
                    label:''
                },
                idInscripcion: new Date().getTime(),
                codigo:'',
                nombre:'',
                carrera:'',
                cantidad_m:''
                
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
            let store = abrirStore('inscripcions', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.inscripcions = data.result
                    .filter(inscripcion=>inscripcion.codigo.includes(this.valor) || 
                    inscripcion.nombre.toLowerCase().includes(this.valor.toLowerCase()) ||
                    inscripcion.carrera.toLowerCase().includes(this.valor.toLowerCase()) ||
                    inscripcion.cantidad_m.toLowerCase().includes(this.valor.toLowerCase()));
            };
        }
    },
    template: `
    <div class="my-4">
        <div class="row">
            <div class="col col-md-6">
                <div class="card">
                    <div class="card-header text-bg">REGISTRO DE INSCRIPCIONES</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">CODIGO</div>
                            <div class="col col-md-3">
                                <v-select-matricula required v-model="inscripcion.matricula" 
                                    :options="matricula">Por favor seleccione un codigo</v-select-matricula>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">NOMBRE</div>
                            <div class="col col-md-5">
                                <input v-model="inscripcion.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">CARRERA</div>
                            <div class="col col-md-5">
                                <input v-model="inscripcion.carrera" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">CANTIDAD DE MATERIAS</div>
                            <div class="col col-md-5">
                                <input v-model="inscripcion.cantidad_m" type="number" min="0" class="form-control">
                            </div>
                        </div>
                        
                        <div class="row p-1">
                        <div class="col text-center">
                            <div class="d-flex justify-content-center ">
                                <button @click.prevent.default="guardarInscripcion" class="btn btn-primary">GUARDAR</button>
                                <div style="margin-right: 20px;"></div>
                                <button @click.prevent.default="nuevoInscripcion" class="btn btn-info">NUEVO</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-md-6">
                <div class="card text-bg">
                    <div class="card-header">LISTADO DE INSCRIPCIONES</div>
                    <div class="card-body">
                        <form id="frmInscripcion">
                            <table class="table table table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="codigo, nombre" type="search" v-model="valor" @keyup="buscarInscripcion" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>CARRERA</th>
                                        <th>N° DE MATERIAS</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarInscripcion(inscripcion)" v-for="inscripcion in inscripcions" :key="inscripcion.idInscripcion">
                                        <td>{{inscripcion.matricula.label}}</td>
                                        <td>{{inscripcion.nombre}}</td>
                                        <td>{{inscripcion.carrera}}</td>
                                        <td>{{inscripcion.cantidad_m}}</td>
                                        <td><button @click.prevent.default="eliminarInscripcion(inscripcion.idInscripcion)" class="btn btn-danger">del</button></td>
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