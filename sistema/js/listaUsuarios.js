document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();
    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0) {
            revisarControl(e, 10, 10);
        } else {
            document.getElementById("txtTelefono").classList.remove("novalido");
            document.getElementById("txtTelefono").setCustomValidity("");
            document.getElementById("txtTelefono").classList.add("valido");
        }
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }

    document.getElementById("txtEmail").onkeyup = e => {
        validarCorreo(e.target.value.trim());
    };


    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
    });




    document.getElementById("btnAceptar").addEventListener("click", e => {
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        e.target.form.classList.add("validado");
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");
        txtNombre.setCustomValidity("");
        txtContrasenia.setCustomValidity("");
        txtContrasenia2.setCustomValidity("");
        txtEmail.setCustomValidity("");
        txtTel.setCustomValidity("");

        if (txtNombre.value.trim().length < 2 || txtNombre.value.trim().length > 60) {
            txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
        }

        //////////////////////////////////////////////////////////////////////
        let operacion = document.querySelector("#mdlRegistro .modal-title").innerText;
        if (operacion == 'Agregar') {
            if (txtContrasenia.value.trim().length < 6 || txtContrasenia.value.trim().length > 20) {
                txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 6 y 20 caracteres)");
            }
            if (txtContrasenia2.value.trim().length < 6 || txtContrasenia2.value.trim().length > 20) {
                txtContrasenia2.setCustomValidity("Confirma la contraseña");
            }
        }
        else {
            txtContrasenia.setCustomValidity("");
            txtContrasenia.removeAttribute("required");
            txtContrasenia2.setCustomValidity("");
            txtContrasenia2.removeAttribute("required");
        }
        /////////////////////////////////////////////////////////////////////////

        if (txtTel.value.trim().length > 0 && txtTel.value.trim().length != 10) {
            txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
        }

        if (txtContrasenia.value !== txtContrasenia2.value) {
            txtContrasenia2.classList.add('novalido');
            e.preventDefault();
            return;
        } else {
            txtContrasenia2.classList.remove('novalido');
        }

        if (!validarCorreo(txtEmail.value.trim())) {
            txtEmail.setCustomValidity("Correo electrónico no válido");
            txtEmail.classList.add("novalido");
            e.preventDefault();
            return;
        } else {
            txtEmail.classList.remove('novalido');
        }

        if (e.target.form.checkValidity()) {
            //Crear el objeto usuario y guardarlo en el storage
            let correo = document.getElementById("txtCorreoOriginal").value.trim();
            let usuario = {
                nombre: txtNombre.value.trim(),
                correo: txtEmail.value.trim(),
                contrasenia: txtContrasenia.value.trim(),
                telefono: txtTelefono.value.trim()
            };
            /////////////////////////////////////////////////////////////////////////////////////
            debugger;
            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            if (document.querySelector("#mdlRegistro .modal-title").innerText == 'Agregar') {
                let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                if (usuarioEncontrado) {
                    mostrarAlerta("Este correo ya se encuentra registrado, favor de usar otro");
                    e.preventDefault();
                    return;
                }
                usuarios.push(usuario);
            } else {
                if (usuario.correo != correo) {
                    let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                    if (usuarioEncontrado) {
                        mostrarAlerta("Este correo ya se encuentra registrado, favor de usar otro");
                        e.preventDefault();
                        return;
                    }

                }
                let index = usuarios.findIndex((element) => element.correo === correo);
                if (index !== -1) {
                    // Actualizar el usuario con la nueva información
                    usuarios[index] = usuario;
                }
            }
            console.log(JSON.stringify(usuarios));
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            ///////////////////////////////////////////////////////////////////////////////////////
        } else {
            e.preventDefault();
        }

        
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        let operacion = e.relatedTarget.innerText;
        e.target.querySelector(".modal-title").innerText = operacion;

        ////////////////////////////////////////////////////////////////////////////////////////////
        if (operacion == 'Editar') {

            document.getElementById("txtPassword").style.display = "none";
            document.getElementById("txtConfirmarPassword").style.display = "none";
            document.querySelector('label[for="txtPassword"]').style.display = "none";
            document.querySelector('label[for="txtConfirmarPassword"]').style.display = "none";

            let correo = e.relatedTarget.value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios'));
            let usuario = usuarios.find((element => element.correo == correo));
            document.getElementById("txtNombre").value = usuario.nombre;
            document.getElementById("txtEmail").value = usuario.correo;
            document.getElementById("txtCorreoOriginal").value = usuario.correo;
            document.getElementById("txtTelefono").value = usuario.telefono;


        }
        else {
            document.getElementById("txtPassword").style.display = "block";
            document.getElementById("txtConfirmarPassword").style.display = "block";
            document.querySelector('label[for="txtPassword"]').style.display = "block";
            document.querySelector('label[for="txtConfirmarPassword"]').style.display = "block";

        }
        document.getElementById("txtNombre").focus();
        ///////////////////////////////////////////////////////////////////////////////////////////////


    });

    document.getElementById("mdlEliminar").addEventListener('shown.bs.modal', (e) => {
        let body=document.getElementById("mdlEliminar").querySelector('.modal-body');
        let correo = e.relatedTarget.value;
        let usuarios=JSON.parse(localStorage.getItem('usuarios'));
        let usuario=usuarios.find((element=>element.correo==correo));
        body.innerHTML = `¿Está seguro de que desea eliminar al usuario <strong>${usuario.nombre}</strong>?`;
        indiceUsuario = usuarios.findIndex(element=>element.correo==correo);
        
        document.getElementById("btnEliminar").addEventListener('click', (e) => {          
            usuarios.splice(indiceUsuario, 1);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            location.reload();
        });
    });
    document.getElementById("mdlCambiarContrasena").addEventListener('shown.bs.modal', (e) => {
        let txtNuevaContrasena = document.getElementById("txtNuevaContrasena");
        let txtConfirmarContrasena = document.getElementById("txtConfirmarContrasena");
        txtNuevaContrasena.value="";
        txtConfirmarContrasena.value="";
        txtNuevaContrasena.setCustomValidity("");
        txtConfirmarContrasena.setCustomValidity("");

        txtNuevaContrasena.classList.remove('novalido');
        txtNuevaContrasena.classList.remove('valido');
        txtNuevaContrasena.nextElementSibling.textContent = "";
        txtNuevaContrasena.nextElementSibling.style.display = "none";

        txtConfirmarContrasena.classList.remove('novalido');
        txtConfirmarContrasena.classList.remove('valido');
        txtConfirmarContrasena.nextElementSibling.textContent = "";
        txtConfirmarContrasena.nextElementSibling.style.display = "none";

        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }
    
        // Validar contraseñas en tiempo real mientras se escriben
        txtNuevaContrasena.addEventListener("input", () => {
            validarContrasena(txtNuevaContrasena);
            let alert = e.target.parentElement.querySelector(".alert");
            if (alert) {
                alert.remove();
            }
        });
    
        txtConfirmarContrasena.addEventListener("input", () => {
            validarContrasena(txtConfirmarContrasena);
            let alert = e.target.parentElement.querySelector(".alert");
            if (alert) {
                alert.remove();
            }
        });

        console.log(e.target);
        let correo = e.relatedTarget.value;
        // Event listener para el botón Aceptar
        document.getElementById("btnAceptarContrasena").addEventListener('click', (e) => {
            
            console.log(correo);
            let alert = e.target.parentElement.querySelector(".alert");
            if (alert) {
                alert.remove();
            }
            // Obtener el arreglo de usuarios del almacenamiento local
            let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    
            // Encontrar al usuario por su correo
            let usuario = usuarios.find((element => element.correo == correo));
            
            // Validar las contraseñas nuevamente antes de aceptar
            validarContrasena(txtNuevaContrasena);
            validarContrasena(txtConfirmarContrasena);
    
            // Verificar si las contraseñas coinciden
            if (txtNuevaContrasena.value !== txtConfirmarContrasena.value || !txtNuevaContrasena.validity.valid || !txtConfirmarContrasena.validity.valid) {
                // Mostrar mensaje de error si las contraseñas no coinciden o no son válidas
                let alerta = document.createElement('div');
                alerta.innerHTML = 'Las contraseñas no coinciden o son inválidas <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                alerta.className = "alert alert-danger alert-dismissible fade show";
                e.target.parentElement.insertBefore(alerta, e.target);
    
                // Aplicar estilo de borde rojo al campo de confirmar contraseña
                txtConfirmarContrasena.classList.add('novalido');
                txtConfirmarContrasena.classList.remove('valido');
    
                // Prevenir el envío del formulario
                e.preventDefault();
                return;
            } else {
                // Eliminar el estilo de borde rojo del campo de confirmar contraseña
                txtConfirmarContrasena.classList.remove('novalido');
    
                // Actualizar la contraseña del usuario en el arreglo
                usuario.password = txtNuevaContrasena.value;
    
                // Guardar los cambios en el almacenamiento local
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
                // Recargar la página para aplicar los cambios
                location.reload();
            }
        });

        document.getElementById("btnLimpiarContrasena").addEventListener('click', (e) => {
            let alert = e.target.parentElement.querySelector(".alert");
            if (alert) {
                alert.remove();
            }
            txtNuevaContrasena.setCustomValidity("");
            txtConfirmarContrasena.setCustomValidity("");

            txtNuevaContrasena.classList.remove('novalido');
            txtNuevaContrasena.classList.remove('valido');
            txtNuevaContrasena.nextElementSibling.textContent = "";
            txtNuevaContrasena.nextElementSibling.style.display = "none";

            txtConfirmarContrasena.classList.remove('novalido');
            txtConfirmarContrasena.classList.remove('valido');
            txtConfirmarContrasena.nextElementSibling.textContent = "";
            txtConfirmarContrasena.nextElementSibling.style.display = "none";
        });

    });

});



function revisarControl(e, min, max) {
    txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min || txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }
}

function validarCorreo(correo) {
    const regexCorreo = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/;
    const esValido = regexCorreo.test(correo);
    if (!esValido) {
        // Agregar la clase 'novalido' al campo de entrada
        document.getElementById("txtEmail").classList.remove("valido");
        document.getElementById("txtEmail").classList.add("novalido");
        document.getElementById("txtCorreoOriginal").classList.remove("valido");
        document.getElementById("txtCorreoOriginal").classList.add("novalido");
    } else {
        // Si es válido, asegúrate de quitar la clase 'novalido' si estaba presente
        document.getElementById("txtEmail").classList.remove("novalido");
        document.getElementById("txtEmail").classList.add("valido");
        document.getElementById("txtCorreoOriginal").classList.remove("novalido");
        document.getElementById("txtCorreoOriginal").classList.add("valido");
    }
    return esValido;
}
function validarContrasena(input) {
    let contrasena = input.value.trim();
    let mensajeError = "";

    console.log(input);
    // Validar longitud de la contraseña
    if (contrasena.length < 6 || contrasena.length > 20) {
        mensajeError = "La contraseña debe tener entre 6 y 20 caracteres";
    }
    // Mostrar el mensaje de error y aplicar estilo si es necesario
    let mensajeElement = input.nextElementSibling;
    if (mensajeError) {
        input.classList.add("novalido");
        mensajeElement.textContent = mensajeError;
        mensajeElement.style.display = "block";
        input.classList.remove("valido");
    } else {
        input.classList.remove("novalido");
        mensajeElement.textContent = "";
        mensajeElement.style.display = "none";
        input.classList.add("valido");
    }
}


function mostrarAlerta(mensaje) {
    let alerta = document.createElement('div');
    alerta.innerHTML = `${mensaje} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    alerta.className = "alert alert-warning alert-dismissible fade show";
    document.getElementById("btnAceptar").parentElement.insertBefore(alerta, document.getElementById("btnAceptar"));
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    for (var i = 0; i < usuarios.length; i++) {
        usuario = usuarios[i];
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.innerText = usuario.nombre;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="' + usuario.correo + '" onclick="editar(' + i + ')">Editar</button>';
        fila.appendChild(celda);
        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" class="btn btn-warning"  data-bs-toggle="modal" data-bs-target="#mdlCambiarContrasena" value="'+usuario.correo+'" >Cambiar contraseña</button>';
        fila.appendChild(celda);
        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" class="btn btn-danger"  data-bs-toggle="modal" data-bs-target="#mdlEliminar" value="'+usuario.correo+'" data-id=' + i +'>Eliminar</button>';
        fila.appendChild(celda);
        tbody.appendChild(fila);
    }
}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel@gmail.com',
                password: '123456',
                telefono: ''
            },
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena@gmail.com',
                password: '567890',
                telefono: '4454577468'
            }
        ];

        usuarios.push(
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel1@gmail.com',
                password: '123456',
                telefono: ''
            });
        usuarios.push(
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena1@gmail.com',
                password: '567890',
                telefono: '4454577468'
            });

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

    }
}