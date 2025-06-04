package co.com.SPR.stepsdefinitions;

import co.com.SPR.questions.ValidacionInicioSesion;
import co.com.SPR.questions.ValidacionPerfilContratista;
import co.com.SPR.tasks.AbrirPerfil;
import co.com.SPR.tasks.NavegarPerfil;
import co.com.SPR.tasks.abrirSPR;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class PerfilContratistaStepDefinitions {
    @Cuando("^el usuario ira al apartado de usuario y seleccionara la opcion de perfil$")
    public void elUsuarioIraAlApartadoDeUsuarioYSeleccionaraLaOpcionDePerfil() {
        theActorInTheSpotlight().attemptsTo(NavegarPerfil.navegarPerfil());
    }


    @Entonces("^el usuario podra visualizar toda su informacion personal y opciones como eliminar cuenta, actualizar datos y regresar al incio\\.$")
    public void elUsuarioPodraVisualizarTodaSuInformacionPersonalYOpcionesComoEliminarCuentaActualizarDatosYRegresarAlIncio() {
        theActorInTheSpotlight().should(seeThat(ValidacionPerfilContratista.validacionPerfilContratista()));
    }
}
