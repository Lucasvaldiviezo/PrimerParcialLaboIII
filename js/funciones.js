var rowGlobal;
window.onload=inicializador;

function inicializador()
{
    var gifCargando = document.getElementById("cargando");
    gifCargando.hidden = true;
    var contAgregar= document.getElementById("contAgregar");
    contAgregar.hidden = true;

    tCuerpo = document.getElementById("tCuerpo");   

    var btnCerrar = document.getElementById("btnCerrar");
    btnCerrar.onclick = function()
    {
        contAgregar.hidden = true;
    }

    var btnModificar = document.getElementById("btnModificar");
    btnModificar.onclick = function()
    {
        var nombre = document.getElementById("name").value;
        var cuatrimestre = document.getElementById("cuatrimestre").value;
        var fechaFinal = document.getElementById("fechaFinal").value;
        var mañana = document.getElementById("mañana");
        var noche = document.getElementById("noche");
        var fechaEnArray = fechaFinal.split("-");
        var auxFecha = fechaEnArray[2] +"/"+ fechaEnArray[1] +"/"+ fechaEnArray[0];
        if(obtenerFecha(fechaFinal) < Date.now())
        {
            if(nombre.length >= 6 && (mañana.checked == true || noche.checked == true))
            {
                document.getElementById("cuatrimestre").disabled = true;
                gifCargando.hidden = false;
                var resultado = confirm("Esta seguro que desea modificar una materia?");
                var httpPost = new XMLHttpRequest();
                if(resultado == true)
                {
                    
                    httpPost.onreadystatechange=function()
                    {
                        if(httpPost.readyState==4&&http.status==200)
                        {
                                document.getElementById("name").className="sinError";
                                document.getElementById("cuatrimestre").className="sinError";
                                document.getElementById("fechaFinal").className="sinError";
                                
                                rowGlobal.childNodes[0].innerHTML = nombre;
                                rowGlobal.childNodes[1].innerHTML = cuatrimestre;
                                rowGlobal.childNodes[2].innerHTML = auxFecha;
                                if(mañana.checked == true)
                                {
                                    rowGlobal.childNodes[3].innerHTML = "Mañana";
                                }else if(noche.checked == true)
                                {
                                    rowGlobal.childNodes[3].innerHTML = "Noche"
                                }
                                gifCargando.hidden = true;
                                contAgregar.hidden = true;
                                document.getElementById("cuatrimestre").disabled = false;
                        }
                    }
    
                    httpPost.open("POST","http://localhost:3000/editar",true);
                    httpPost.setRequestHeader("Content-Type","application/json");
                    if(mañana.checked == true)
                    {
                        var json = {"id" : rowGlobal.getAttribute("idMateria"),"nombre" : nombre, "cuatrimestre" : cuatrimestre, "fechaFinal" : auxFecha, "turno" : "Mañana"};
                    }else if(noche.checked == true)
                    {
                        var json = {"id" : rowGlobal.getAttribute("idMateria"),"nombre" : nombre, "cuatrimestre" : cuatrimestre, "fechaFinal" : auxFecha, "turno" : "Noche"};
                    }
                    httpPost.send(JSON.stringify(json));
                }       
            }else
            {
                document.getElementById("name").className="error";
                document.getElementById("cuatrimestre").className="error";
                alert("El nombre de la materia debe tener mas de 3 caracteres");
                return;
            }
        }else
        {
            alert("La fecha debe ser menor al dia de hoy");
            document.getElementById("fechaFinal").className="error";
            return;
        }
        
    }

    var btnEliminar = document.getElementById("btnEliminar");
    btnEliminar.onclick = function()
    {
        gifCargando.hidden = false;
        var httpPost = new XMLHttpRequest();
        httpPost.onreadystatechange=function()
        {
            if(httpPost.readyState==4&&http.status==200)
            {
                    rowGlobal.remove();  
                    gifCargando.hidden = true;
                    contAgregar.hidden = true;
            }
        }
        httpPost.open("POST","http://localhost:3000/eliminar",true);
        httpPost.setRequestHeader("Content-Type","application/json");
        var json = {"id" : rowGlobal.getAttribute("idMateria")};
        httpPost.send(JSON.stringify(json));
    }

    var http = new XMLHttpRequest;
    http.onreadystatechange = callback;
    http.open("GET","http://localhost:3000/materias ");
    http.send();

    function callback()
    {
        if(http.readyState===4)
        {
            if(http.status===200)
            {
                armarGrilla(JSON.parse(http.responseText));
            }else
            {
                console.log("Tenemos un error!!");
            }
        }
    }
   
    function armarGrilla(jsonObj)
    {
        var tCuerpo = document.getElementById("tCuerpo");
       
        for(var i = 0;i<jsonObj.length;i++)
        {
            var row = document.createElement("tr"); //Creo la fila
            var cel1 = document.createElement("td");
            var cel2 = document.createElement("td");
            var cel3 = document.createElement("td");
            var cel4 = document.createElement("td");
            var cel5 = document.createElement("td");
            //var text = document.createTextNode(jsonObj[i].id);
            row.setAttribute("idMateria",jsonObj[i].id);
            var text1 = document.createTextNode(jsonObj[i].nombre);
            var text2 = document.createTextNode(jsonObj[i].cuatrimestre);
            var text3 = document.createTextNode(jsonObj[i].fechaFinal);
            var text4 = document.createTextNode(jsonObj[i].turno);
            cel1.appendChild(text1);
            cel2.appendChild(text2);
            cel3.appendChild(text3);
            cel4.appendChild(text4);
            row.appendChild(cel1);
            row.appendChild(cel2);
            row.appendChild(cel3);
            row.appendChild(cel4);
            row.addEventListener("dblclick",clickGrilla);
            tCuerpo.appendChild(row);
        }
    }

    function clickGrilla(e)
    {
        console.log(e.target.parentNode);//se pueden utilizar los indices
        var trClick = e.target.parentNode;
        document.getElementById("name").value = trClick.childNodes[0].innerHTML;
        switch(trClick.childNodes[1].innerHTML)
        {
            case "1":
                document.getElementById("cuatrimestre").value = "1";
            break;
            case "2":
                document.getElementById("cuatrimestre").value = "2";
            break;
            case "3":
                document.getElementById("cuatrimestre").value = "3";
            break;
            case "4":
                document.getElementById("cuatrimestre").value = "4";
            break;
        }
        var fechaEnArray = trClick.childNodes[2].innerHTML.split("/");
        var auxFecha = fechaEnArray[2] +"-"+ fechaEnArray[1] +"-"+ fechaEnArray[0];
        document.getElementById("fechaFinal").value = auxFecha;
        rowGlobal = trClick;
        if(trClick.childNodes[3].innerHTML == "Mañana")
        {
            document.getElementById("mañana").checked = true;
        }else
        {
            document.getElementById("noche").checked = true;
        }
        contAgregar.hidden = false;
    }

    function obtenerFecha(auxFecha){

        let data= new Date();
        var fechaEnArray = auxFecha.split("-");//Divide un string en un array delimitado por -
        //osea nos da un array de 3 donde en el index 0 esta el año, 1 el mes y 2 el dia
        data.setFullYear(fechaEnArray[0]);
        //Los meses para un date arrancan de 0. Si los tenemos que setear -1 y cuando los mostramos +1
        data.setMonth(fechaEnArray[1]-1);
        data.setDate(fechaEnArray[2]);
        return data;
    }
    
}