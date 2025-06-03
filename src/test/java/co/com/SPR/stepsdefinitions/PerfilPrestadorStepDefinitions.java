package co.com.SPR.stepsdefinitions;

import co.com.SPR.tasks.AbrirPerfil;
import co.com.SPR.tasks.NavegarPerfil;
import co.com.SPR.tasks.abrirSPR;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class PerfilPrestadorStepDefinitions {
    @Dado("^que el usuario se encuentra en la pagina de inicio de sesion de SPR de prestador$")
    public void queElUsuarioSeEncuentraEnLaPaginaDeInicioDeSesionDeSPRDePrestador() {
        theActorInTheSpotlight().wasAbleTo(abrirSPR.lapagina());
    }


    @Cuando("^vaya al apartado de usuario y seleccione la opcion de perfil$")
    public void vayaAlApartadoDeUsuarioYSeleccioneLaOpcionDePerfil() {
        theActorInTheSpotlight().wasAbleTo(NavegarPerfil.navegarPerfil());
    }

    @Entonces("^el usuario podra visualizar toda su informacion personal y opciones como eliminar cuenta, actualizar datos y regresar al incio de spr\\.$")
    public void elUsuarioPodraVisualizarTodaSuInformacionPersonalYOpcionesComoEliminarCuentaActualizarDatosYRegresarAlIncioDeSpr() {
        theActorInTheSpotlight().attemptsTo(AbrirPerfil.elperfil());
    }
}
