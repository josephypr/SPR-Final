package co.com.SPR.stepsdefinitions;

import co.com.SPR.questions.ValidacionPerfilPrestador;
import co.com.SPR.tasks.AbrirPerfil;
import co.com.SPR.tasks.NavegarPerfil;
import co.com.SPR.tasks.abrirSPR;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class PerfilPrestadorStepDefinitions {
    @Cuando("^el usuario vaya al boton de usuario y seleccione la opcion de perfil$")
    public void elUsuarioVayaAlBotonDeUsuarioYSeleccioneLaOpcionDePerfil() {
        theActorInTheSpotlight().attemptsTo(NavegarPerfil.navegarPerfil());
    }


    @Entonces("^el usuario podra visualizar toda su informacion personal y opciones como eliminar cuenta, actualizar datos y regresar al incio de spr\\.$")
    public void elUsuarioPodraVisualizarTodaSuInformacionPersonalYOpcionesComoEliminarCuentaActualizarDatosYRegresarAlIncioDeSpr() {
        theActorInTheSpotlight().should(seeThat(ValidacionPerfilPrestador.validacionPerfilPrestador()));
    }

}
